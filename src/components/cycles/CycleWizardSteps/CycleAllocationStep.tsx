import type { Balance } from "../../../types/balance";
import type { PaymentAllocationInput } from "../../../types/payment";
import { formatCurrency } from "../../../utils/currency";
import { AllocationEditor } from "../../ui/AllocationEditor";
import styles from "./CycleWizardSteps.module.css";

interface CycleAllocationStepProps {
  balances: Balance[];
  allocations: PaymentAllocationInput[];
  amount: number;
  onChange(allocations: PaymentAllocationInput[]): void;
}

export function CycleAllocationStep({
  balances,
  allocations,
  amount,
  onChange,
}: CycleAllocationStepProps) {
  return (
    <div className={styles.stepBody}>
      <span className={styles.fieldLabel}>Where does each payment go?</span>
      <AllocationEditor
        title={`Split of every ${formatCurrency(amount)}`}
        balances={balances}
        allocations={allocations}
        amount={amount}
        onChange={onChange}
      />
    </div>
  );
}
