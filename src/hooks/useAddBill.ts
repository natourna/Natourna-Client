import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { balanceService, billService, toErrorMessage } from "../services";
import { todayIso } from "../utils/date";
import { toFieldErrors, type FieldErrors } from "../utils/formErrors";
import { useAsyncData } from "./useAsyncData";

const addBillSchema = z.object({
  label: z.string().min(1, "Enter a label."),
  amount: z.number().positive("Amount must be greater than zero."),
  balanceId: z.string().min(1, "Choose a fund."),
  dueDate: z.string().min(1, "Choose a due date."),
});

type AddBillValues = z.infer<typeof addBillSchema>;

export function useAddBill() {
  const navigate = useNavigate();

  const loader = useCallback(() => balanceService.getBalances(), []);
  const { data: balances, isLoading, error, reload } = useAsyncData(loader);

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState(0);
  const [balanceId, setBalanceId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState(todayIso());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<AddBillValues>>({});

  const values = { label: label.trim(), amount, balanceId: balanceId ?? "", dueDate };

  const selectedBalance = balances?.find((balance) => balance.id === balanceId) ?? null;
  const cannotCover =
    selectedBalance !== null && amount > 0 && selectedBalance.currentAmount < amount;
  const canCover = selectedBalance !== null && amount > 0 && !cannotCover;

  const isValid = addBillSchema.safeParse(values).success && canCover;

  const submit = async () => {
    const parsed = addBillSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }
    if (!canCover) return;

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await billService.createBill(parsed.data);
      navigate("/bills");
    } catch (cause) {
      setSubmitError(toErrorMessage(cause));
      setIsSubmitting(false);
    }
  };

  return {
    balances: balances ?? [],
    isLoading,
    error,
    reload,
    label,
    setLabel,
    amount,
    setAmount,
    balanceId,
    setBalanceId,
    dueDate,
    setDueDate,
    selectedBalance,
    canCover,
    cannotCover,
    isValid,
    isSubmitting,
    submitError,
    fieldErrors,
    submit,
  };
}
