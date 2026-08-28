import type { PaymentCycle } from "../../../types/cycle";
import { DateField, TextField } from "../../ui/FormField";
import { CheckCircleIcon } from "../../ui/Icons";
import { frequencyOptions } from "./cycleFrequency";
import styles from "./CycleWizardSteps.module.css";

interface CycleBasicsStepProps {
  label: string;
  onLabelChange(value: string): void;
  paymentCycle: PaymentCycle;
  onPaymentCycleChange(value: PaymentCycle): void;
  startDate: string;
  onStartDateChange(value: string): void;
  endDate: string;
  onEndDateChange(value: string): void;
}

export function CycleBasicsStep({
  label,
  onLabelChange,
  paymentCycle,
  onPaymentCycleChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: CycleBasicsStepProps) {
  return (
    <div className={styles.stepBody}>
      <TextField label="What should we call it?" value={label} onChange={onLabelChange} />
      <div className={styles.field}>
        <span className={styles.fieldLabel}>How often?</span>
        <div className={styles.frequencyGrid} role="radiogroup" aria-label="How often?">
          {frequencyOptions.map((option) => {
            const isSelected = paymentCycle === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`${styles.frequencyOption} ${isSelected ? styles.frequencySelected : ""}`}
                onClick={() => onPaymentCycleChange(option.value)}
              >
                {isSelected ? <CheckCircleIcon size={17} /> : null}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.dateRow}>
        <DateField label="From" value={startDate} onChange={onStartDateChange} />
        <DateField label="Until" value={endDate} onChange={onEndDateChange} />
      </div>
    </div>
  );
}
