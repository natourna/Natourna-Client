import { AlertBanner } from "../../../components/ui/AlertBanner";
import { BackLink } from "../../../components/ui/BackLink";
import { Button } from "../../../components/ui/Button";
import { DateField, TextField } from "../../../components/ui/FormField";
import { FundPicker } from "../../../components/ui/FundPicker";
import { CheckCircleIcon } from "../../../components/ui/Icons";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useAddBill } from "../../../hooks/useAddBill";
import { formatCurrency } from "../../../utils/currency";
import styles from "./AddBillPage.module.css";

export function AddBillPage() {
  const form = useAddBill();

  if (form.isLoading) return <LoadingState />;
  if (form.error) return <ErrorState message={form.error} onRetry={form.reload} />;

  return (
    <div className={`page ${styles.page}`}>
      <BackLink to="/bills" label="Bills" />
      <h1 className={styles.title}>Add a bill</h1>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
      >
        <TextField
          label="What is it for?"
          value={form.label}
          onChange={form.setLabel}
          placeholder="Elevator repair"
          error={form.fieldErrors.label}
        />
        <TextField
          label="Amount"
          inputMode="numeric"
          value={form.amount === 0 ? "" : String(form.amount)}
          onChange={(value) => form.setAmount(Number(value.replace(/\D/g, "")) || 0)}
          placeholder="300"
        />
        <FundPicker
          label="Take the money from"
          balances={form.balances}
          value={form.balanceId}
          onChange={form.setBalanceId}
        />
        <DateField label="Due date" value={form.dueDate} onChange={form.setDueDate} error={form.fieldErrors.dueDate} />
        {form.canCover && form.selectedBalance ? (
          <div className={styles.coverOk}>
            <CheckCircleIcon size={18} />
            The {form.selectedBalance.label} can cover this bill.
          </div>
        ) : null}
        {form.cannotCover && form.selectedBalance ? (
          <AlertBanner
            variant="danger"
            title={`The ${form.selectedBalance.label} only has ${formatCurrency(form.selectedBalance.currentAmount)} — this bill is ${formatCurrency(form.amount)}.`}
            subtitle="Choose another fund or lower the amount."
          />
        ) : null}
        {form.submitError ? <AlertBanner variant="danger" title={form.submitError} /> : null}
        <Button type="submit" size="lg" fullWidth disabled={!form.isValid || form.isSubmitting}>
          {form.isSubmitting ? "Saving…" : "Save bill"}
        </Button>
      </form>
    </div>
  );
}
