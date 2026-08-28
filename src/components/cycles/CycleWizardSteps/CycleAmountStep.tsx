import type { PaymentCycle } from "../../../types/cycle";
import { AmountStepper } from "../../ui/AmountStepper";
import { frequencyPhrases } from "./cycleFrequency";
import styles from "./CycleWizardSteps.module.css";

interface CycleAmountStepProps {
  amount: number;
  onAmountChange(value: number): void;
  paymentCycle: PaymentCycle;
}

export function CycleAmountStep({ amount, onAmountChange, paymentCycle }: CycleAmountStepProps) {
  return (
    <div className={styles.amountStep}>
      <span className={styles.amountLabel}>How much, per apartment?</span>
      <AmountStepper
        size="lg"
        label="Amount per apartment"
        value={amount}
        onChange={onAmountChange}
      />
      <span className={styles.amountHint}>
        {frequencyPhrases[paymentCycle]}, from every selected apartment
      </span>
    </div>
  );
}
