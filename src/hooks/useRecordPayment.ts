import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import type { PaymentAllocationInput } from "../types/payment";
import { apartmentService, balanceService, cycleService, paymentService, toErrorMessage } from "../services";
import { todayIso } from "../utils/date";
import { toFieldErrors, type FieldErrors } from "../utils/formErrors";
import { totalPercentage } from "../utils/percentage";
import { useAsyncData } from "./useAsyncData";

const recordPaymentSchema = z.object({
  apartmentId: z.string().min(1, "Choose an apartment."),
  label: z.string().min(1, "Enter a label."),
  amount: z.number().positive("Amount must be greater than zero."),
  dueDate: z.string().min(1, "Choose a due date."),
});

type RecordPaymentValues = z.infer<typeof recordPaymentSchema>;

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RecordPaymentValues>>({});

  const allocations = editedAllocations ?? data?.activeCycle?.balanceAllocations ?? [];
  const allocationsValid =
    totalPercentage(allocations.map((allocation) => allocation.percentage)) === 100;

  const values = { apartmentId, label: label.trim(), amount, dueDate };

  const isValid = recordPaymentSchema.safeParse(values).success && allocationsValid;

  const submit = async () => {
    const parsed = recordPaymentSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }
    if (!allocationsValid) return;

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await paymentService.createPayment({
        ...parsed.data,
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
    fieldErrors,
    submit,
  };
}
