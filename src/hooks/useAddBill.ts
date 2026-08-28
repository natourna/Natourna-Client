import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { billInputSchema } from "../schemas/bill";
import { balanceService, billService, toErrorMessage } from "../services";
import { todayIso } from "../utils/date";
import { useAsyncData } from "./useAsyncData";

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

  const selectedBalance = balances?.find((balance) => balance.id === balanceId) ?? null;
  const cannotCover =
    selectedBalance !== null && amount > 0 && selectedBalance.currentAmount < amount;
  const canCover = selectedBalance !== null && amount > 0 && !cannotCover;

  const parsed = billInputSchema.safeParse({
    label: label.trim(),
    amount,
    dueDate,
    balanceId: balanceId ?? "",
  });

  const isValid = parsed.success && canCover;

  const submit = async () => {
    if (!parsed.success || !canCover) return;
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
    submit,
  };
}
