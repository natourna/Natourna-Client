import type { Balance } from "../../../types/balance";
import type { PaymentAllocationInput } from "../../../types/payment";
import { formatCurrency } from "../../../utils/currency";
import { percentageOf, totalPercentage } from "../../../utils/percentage";
import { AlertTriangleIcon, CheckCircleIcon } from "../Icons";
import styles from "./AllocationEditor.module.css";

const segmentColors = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-neutral-chip)",
];

interface AllocationEditorProps {
  title: string;
  balances: Balance[];
  allocations: PaymentAllocationInput[];
  amount: number;
  onChange(allocations: PaymentAllocationInput[]): void;
}

function percentageFor(allocations: PaymentAllocationInput[], balanceId: string): number {
  return allocations.find((allocation) => allocation.balanceId === balanceId)?.percentage ?? 0;
}

export function AllocationEditor({
  title,
  balances,
  allocations,
  amount,
  onChange,
}: AllocationEditorProps) {
  const total = totalPercentage(allocations.map((allocation) => allocation.percentage));
  const isComplete = total === 100;
  const activeShares = balances
    .map((balance, index) => ({
      balance,
      color: segmentColors[index % segmentColors.length],
      percentage: percentageFor(allocations, balance.id),
    }))
    .filter((share) => share.percentage > 0);

  const setPercentage = (balanceId: string, raw: string) => {
    const percentage = Math.max(0, Math.min(100, Number(raw) || 0));
    const others = allocations.filter((allocation) => allocation.balanceId !== balanceId);
    onChange(
      percentage > 0 ? [...others, { balanceId, percentage }] : others,
    );
  };

  return (
    <div className={styles.editor}>
      <div className={styles.title}>{title}</div>
      {balances.map((balance, index) => {
        const percentage = percentageFor(allocations, balance.id);
        return (
          <div
            key={balance.id}
            className={`${styles.row} ${percentage === 0 ? styles.inactive : ""}`}
          >
            <span
              className={styles.dot}
              style={{ background: percentage > 0 ? segmentColors[index % segmentColors.length] : "var(--color-neutral-chip)" }}
            />
            <span className={styles.name}>{balance.label}</span>
            <div className={styles.percentWrapper}>
              <input
                className={styles.percentInput}
                type="number"
                inputMode="numeric"
                min={0}
                max={100}
                aria-label={`${balance.label} percentage`}
                value={percentage}
                onChange={(event) => setPercentage(balance.id, event.target.value)}
              />
              <span aria-hidden="true">%</span>
            </div>
          </div>
        );
      })}
      {activeShares.length > 0 ? (
        <div className={styles.bar} aria-hidden="true">
          {activeShares.map((share) => (
            <div
              key={share.balance.id}
              style={{ width: `${share.percentage}%`, background: share.color }}
            />
          ))}
        </div>
      ) : null}
      <div className={`${styles.summary} ${isComplete ? styles.summaryOk : styles.summaryWarn}`}>
        {isComplete ? <CheckCircleIcon size={18} /> : <AlertTriangleIcon size={18} />}
        {isComplete
          ? `Adds up to 100% — ${activeShares
              .map((share) => formatCurrency(percentageOf(amount, share.percentage)))
              .join(" and ")}`
          : `Adds up to ${total}% — it must reach 100%.`}
      </div>
    </div>
  );
}
