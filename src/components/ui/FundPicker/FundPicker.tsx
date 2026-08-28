import type { Balance } from "../../../types/balance";
import { formatCurrency } from "../../../utils/currency";
import { CheckCircleIcon } from "../Icons";
import styles from "./FundPicker.module.css";

interface FundPickerProps {
  label: string;
  balances: Balance[];
  value: string | null;
  onChange(balanceId: string): void;
}

export function FundPicker({ label, balances, value, onChange }: FundPickerProps) {
  return (
    <div className={styles.picker} role="radiogroup" aria-label={label}>
      <div className={styles.label}>{label}</div>
      {balances.map((balance) => {
        const isSelected = balance.id === value;
        return (
          <button
            key={balance.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`${styles.option} ${isSelected ? styles.selected : ""}`}
            onClick={() => onChange(balance.id)}
          >
            {isSelected ? (
              <CheckCircleIcon size={24} className={styles.checkIcon} />
            ) : (
              <span className={styles.radioCircle} />
            )}
            <span className={styles.name}>{balance.label}</span>
            <span className={styles.amount}>has {formatCurrency(balance.currentAmount)}</span>
          </button>
        );
      })}
    </div>
  );
}
