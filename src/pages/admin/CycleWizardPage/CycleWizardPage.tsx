import {
  CycleAllocationStep,
  CycleAmountStep,
  CycleApartmentsStep,
  CycleBasicsStep,
  CycleReviewStep,
  frequencyLabel,
} from "../../../components/cycles/CycleWizardSteps";
import { BackLink } from "../../../components/ui/BackLink";
import { Button } from "../../../components/ui/Button";
import { CheckCircleIcon } from "../../../components/ui/Icons";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { WizardShell } from "../../../components/ui/WizardShell";
import { TOTAL_WIZARD_STEPS, useCycleWizard } from "../../../hooks/useCycleWizard";
import { formatCurrency } from "../../../utils/currency";
import styles from "./CycleWizardPage.module.css";

export function CycleWizardPage() {
  const wizard = useCycleWizard();

  if (wizard.isLoading) return <LoadingState />;
  if (wizard.error) return <ErrorState message={wizard.error} onRetry={wizard.reload} />;

  if (wizard.step > TOTAL_WIZARD_STEPS) {
    return (
      <div className={`page ${styles.donePage}`}>
        <div className={styles.doneCircle}>
          <CheckCircleIcon size={56} strokeWidth={2.5} />
        </div>
        <div className={styles.doneTitle}>Done — {wizard.totalPayments} payments created</div>
        <div className={styles.doneSubtitle}>
          Every selected apartment now has {wizard.dueDatesCount}{" "}
          {frequencyLabel(wizard.paymentCycle).toLowerCase()} payment
          {wizard.dueDatesCount > 1 ? "s" : ""} of {formatCurrency(wizard.amount)}.
        </div>
        <Button size="md" to="/payments">
          View the payments
        </Button>
      </div>
    );
  }

  return (
    <div className={`page ${styles.page}`}>
      <BackLink to="/payments" label="Payments" />
      <WizardShell
        title="Set up recurring dues"
        step={wizard.step}
        totalSteps={TOTAL_WIZARD_STEPS}
        footer={
          <>
            {wizard.step > 1 ? (
              <Button
                variant="secondary"
                size="lg"
                className={styles.backButton}
                onClick={wizard.goBack}
              >
                Back
              </Button>
            ) : null}
            <Button
              size="lg"
              className={styles.nextButton}
              disabled={!wizard.canContinue || wizard.isSubmitting}
              onClick={wizard.goNext}
            >
              {wizard.step === TOTAL_WIZARD_STEPS
                ? wizard.isSubmitting
                  ? "Creating…"
                  : "Yes, create the payments"
                : "Next"}
            </Button>
          </>
        }
      >
        {wizard.step === 1 ? (
          <CycleBasicsStep
            label={wizard.label}
            onLabelChange={wizard.setLabel}
            paymentCycle={wizard.paymentCycle}
            onPaymentCycleChange={wizard.setPaymentCycle}
            startDate={wizard.startDate}
            onStartDateChange={wizard.setStartDate}
            endDate={wizard.endDate}
            onEndDateChange={wizard.setEndDate}
          />
        ) : null}

        {wizard.step === 2 ? (
          <CycleAmountStep
            amount={wizard.amount}
            onAmountChange={wizard.setAmount}
            paymentCycle={wizard.paymentCycle}
          />
        ) : null}

        {wizard.step === 3 ? (
          <CycleApartmentsStep
            apartments={wizard.apartments}
            selectedIds={wizard.selectedIds}
            onToggle={wizard.toggleApartment}
            onSelectAll={wizard.selectAll}
          />
        ) : null}

        {wizard.step === 4 ? (
          <CycleAllocationStep
            balances={wizard.balances}
            allocations={wizard.allocations}
            amount={wizard.amount}
            onChange={wizard.setAllocations}
          />
        ) : null}

        {wizard.step === 5 ? (
          <CycleReviewStep
            label={wizard.label}
            amount={wizard.amount}
            dueDatesCount={wizard.dueDatesCount}
            apartmentCount={wizard.selectedIds.length}
            totalPayments={wizard.totalPayments}
            startDate={wizard.startDate}
            endDate={wizard.endDate}
            allocations={wizard.allocations}
            balances={wizard.balances}
            submitError={wizard.submitError}
          />
        ) : null}
      </WizardShell>
    </div>
  );
}
