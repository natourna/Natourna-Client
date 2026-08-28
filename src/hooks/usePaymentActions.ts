import { useState } from "react";
import type { Balance } from "../types/balance";
import type { Payment } from "../types/payment";
import { paymentService, toErrorMessage } from "../services";
import { formatCurrency } from "../utils/currency";

interface PendingPayment {
  payment: Payment;
  apartmentLabel: string;
}

export function usePaymentActions(balances: Balance[] | null, onChanged: () => void) {
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const balanceLabel = (balanceId: string) =>
    balances?.find((balance) => balance.id === balanceId)?.label ?? "the fund";

  const allocationParts = (payment: Payment) =>
    payment.allocations.map(
      (allocation) =>
        `${formatCurrency(allocation.allocatedAmount)} to the ${balanceLabel(allocation.balanceId)}`,
    );

  const requestMarkAsPaid = (payment: Payment, apartmentLabel: string) => {
    setToastMessage(null);
    setActionError(null);
    setPending({ payment, apartmentLabel });
  };

  const cancelMarkAsPaid = () => setPending(null);

  const confirmMarkAsPaid = async () => {
    if (!pending) return;
    setIsMarking(true);
    try {
      await paymentService.markPaymentAsPaid(pending.payment.id);
      setToastMessage(
        `Done — ${pending.apartmentLabel}'s ${formatCurrency(pending.payment.amount)} added: ${allocationParts(pending.payment).join(" and ")}.`,
      );
      setPending(null);
      onChanged();
    } catch (cause) {
      setActionError(toErrorMessage(cause));
      setPending(null);
    } finally {
      setIsMarking(false);
    }
  };

  const confirmTitle = pending
    ? `Mark ${pending.apartmentLabel}'s ${pending.payment.label.toLowerCase()} (${formatCurrency(pending.payment.amount)}) as paid?`
    : "";
  const confirmSubtitle = pending
    ? `This will add ${allocationParts(pending.payment).join(" and ")}.`
    : "";

  return {
    isConfirmOpen: pending !== null,
    isMarking,
    confirmTitle,
    confirmSubtitle,
    toastMessage,
    actionError,
    requestMarkAsPaid,
    cancelMarkAsPaid,
    confirmMarkAsPaid,
    dismissToast: () => setToastMessage(null),
  };
}
