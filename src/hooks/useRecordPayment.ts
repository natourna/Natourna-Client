import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaymentAllocationInput } from "../types/payment";
import { paymentInputSchema } from "../schemas/payment";
import { apartmentService, balanceService, cycleService, paymentService, toErrorMessage } from "../services";
import { todayIso } from "../utils/date";
import { useAsyncData } from "./useAsyncData";

export function useRecordPayment() {
  const navigate = useNavigate();

  const loader = useCallback(async () => {
    const [apartments, balances, activeCycle] = await Promise.all([
      apartmentService.getAllApartments(),
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

  const parsed = paymentInputSchema.safeParse({
    apartmentId,
    label: label.trim(),
    amount,
    dueDate,
    allocations,
  });

  const isValid = parsed.success;

  const submit = async () => {
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await paymentService.createPayment(parsed.data);
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
