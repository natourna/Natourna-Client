import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaymentAllocationInput } from "../types/payment";
import { apartmentService, balanceService, cycleService, paymentService, toErrorMessage } from "../services";
import { todayIso } from "../utils/date";
import { totalPercentage } from "../utils/percentage";
import { useAsyncData } from "./useAsyncData";

export function useRecordPayment() {
  const navigate = useNavigate();

  const loader = useCallback(async () => {
    const [apartments, balances, activeCycle] = await Promise.all([
      apartmentService.getApartments(),
      balanceService.getBalances(),
      cycleService.getActiveCycle(),
    ]);
    return { apartments, balances, activeCycle };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const [apartmentId, setApartmentId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(50);
  const [dueDate, setDueDate] = useState(todayIso());
  const [editedAllocations, setEditedAllocations] = useState<PaymentAllocationInput[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const allocations = editedAllocations ?? data?.activeCycle?.balanceAllocations ?? [];

  const isValid =
    apartmentId !== "" &&
    label.trim() !== "" &&
    amount > 0 &&
    dueDate !== "" &&
    totalPercentage(allocations.map((allocation) => allocation.percentage)) === 100;

  const submit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await paymentService.createPayment({
        apartmentId,
        label: label.trim(),
        amount,
        dueDate,
        allocations,
      });
      navigate("/payments");
    } catch (cause) {
      setSubmitError(toErrorMessage(cause));
      setIsSubmitting(false);
    }
  };

  return {
    apartments: data?.apartments ?? [],
    balances: data?.balances ?? [],
    isLoading,
    error,
    reload,
    apartmentId,
    setApartmentId,
    label,
    setLabel,
    amount,
    setAmount,
    dueDate,
    setDueDate,
    allocations,
    setAllocations: setEditedAllocations,
    isValid,
    isSubmitting,
    submitError,
    submit,
  };
}
