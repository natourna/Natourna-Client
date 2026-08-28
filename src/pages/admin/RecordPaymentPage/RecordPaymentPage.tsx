import { Link } from "react-router-dom";
import { AlertBanner } from "../../../components/ui/AlertBanner";
import { AllocationEditor } from "../../../components/ui/AllocationEditor";
import { AmountStepper } from "../../../components/ui/AmountStepper";
import { BackLink } from "../../../components/ui/BackLink";
import { Button } from "../../../components/ui/Button";
import { DateField, SelectField, TextField } from "../../../components/ui/FormField";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useRecordPayment } from "../../../hooks/useRecordPayment";
import styles from "./RecordPaymentPage.module.css";

export function RecordPaymentPage() {
  const form = useRecordPayment();

  if (form.isLoading) return <LoadingState />;
  if (form.error) return <ErrorState message={form.error} onRetry={form.reload} />;

  return (
    <div className={`page ${styles.page}`}>
      <BackLink to="/payments" label="Payments" />
      <h1 className={styles.title}>Record a payment</h1>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
      >
        <SelectField
          label="Which apartment?"
          value={form.apartmentId}
          onChange={form.setApartmentId}
          placeholder="Choose an apartment"
          options={form.apartments.map((apartment) => ({
            value: apartment.id,
            label: `${apartment.apartmentInfo} · ${apartment.owner}`,
          }))}
        />
        <TextField
          label="What is it for?"
          value={form.label}
          onChange={form.setLabel}
          placeholder="August dues"
        />
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Amount</span>
          <AmountStepper label="Amount" value={form.amount} onChange={form.setAmount} />
        </div>
        <DateField label="Due date" value={form.dueDate} onChange={form.setDueDate} />
        <AllocationEditor
          title="Where does the money go?"
          balances={form.balances}
          allocations={form.allocations}
          amount={form.amount}
          onChange={form.setAllocations}
        />
        {form.submitError ? <AlertBanner variant="danger" title={form.submitError} /> : null}
        <Button type="submit" size="lg" fullWidth disabled={!form.isValid || form.isSubmitting}>
          {form.isSubmitting ? "Saving…" : "Save payment"}
        </Button>
        <Link to="/payments" className={styles.cancel}>
          Cancel
        </Link>
      </form>
    </div>
  );
}
