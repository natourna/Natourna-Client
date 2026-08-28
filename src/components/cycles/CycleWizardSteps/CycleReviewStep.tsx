import type { Balance } from "../../../types/balance";
import type { PaymentAllocationInput } from "../../../types/payment";
import { formatCurrency } from "../../../utils/currency";
import { formatMonthYear } from "../../../utils/date";
import { AlertBanner } from "../../ui/AlertBanner";
import styles from "./CycleWizardSteps.module.css";

interface CycleReviewStepProps {
  label: string;
  amount: number;
  dueDatesCount: number;
  apartmentCount: number;
  totalPayments: number;
  startDate: string;
  endDate: string;
  allocations: PaymentAllocationInput[];
  balances: Balance[];
  submitError: string | null;
}

export function CycleReviewStep({
  label,
  amount,
  dueDatesCount,
  apartmentCount,
  totalPayments,
  startDate,
  endDate,
  allocations,
  balances,
  submitError,
}: CycleReviewStepProps) {
  const splitText = allocations
    .map(
      (allocation) =>
        `${allocation.percentage}% ${balances.find((balance) => balance.id === allocation.balanceId)?.label ?? ""}`,
    )
    .join(" · ");

  return (
    <div className={styles.stepBody}>
      <span className={styles.fieldLabel}>Please check before confirming</span>
      <div className={styles.summaryCard}>
        This will create{" "}
        <strong>
          {dueDatesCount} payment{dueDatesCount > 1 ? "s" : ""} of {formatCurrency(amount)}
        </strong>{" "}
        for each of <strong>{apartmentCount} apartments</strong> — {totalPayments} payments in
        total, from {formatMonthYear(startDate)} to {formatMonthYear(endDate)}.
      </div>
      <div className={styles.summaryFacts}>
        <div className={styles.summaryFact}>
          <span>Name</span>
          <strong>{label}</strong>
        </div>
        <div className={styles.summaryFact}>
          <span>Split</span>
          <strong>{splitText}</strong>
        </div>
        <div className={styles.summaryFact}>
          <span>Total</span>
          <strong className="tnum">{formatCurrency(amount * totalPayments)}</strong>
        </div>
      </div>
      {submitError ? <AlertBanner variant="danger" title={submitError} /> : null}
      <div className={styles.summaryNote}>You can still edit or delete these payments later.</div>
    </div>
  );
}
