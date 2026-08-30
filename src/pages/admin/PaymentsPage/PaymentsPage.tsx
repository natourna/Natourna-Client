import { AlertBanner } from "../../../components/ui/AlertBanner";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { FilterChips, type FilterChipOption } from "../../../components/ui/FilterChips";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Pagination } from "../../../components/ui/Pagination";
import { EmptyState, ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Toast } from "../../../components/ui/Toast";
import { usePayments, type PaymentFilter } from "../../../hooks/usePayments";
import { formatCurrency } from "../../../utils/currency";
import { paymentDateText, statusLabels } from "../../../utils/paymentStatus";
import styles from "./PaymentsPage.module.css";

export function PaymentsPage() {
  const {
    isLoading,
    error,
    reload,
    filter,
    setFilter,
    rows,
    page,
    setPage,
    totalPages,
    isConfirmOpen,
    isMarking,
    confirmTitle,
    confirmSubtitle,
    toastMessage,
    actionError,
    requestMarkAsPaid,
    cancelMarkAsPaid,
    confirmMarkAsPaid,
    dismissToast,
  } = usePayments();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const chipOptions: FilterChipOption<PaymentFilter>[] = [
    { value: "all", label: "All" },
    { value: "due", label: "Not paid" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Payments"
        subtitle="Dues owed by apartments"
        actions={
          <>
            <Button variant="secondary" className={styles.desktopOnly} to="/cycles/new">
              Set up recurring dues
            </Button>
            <Button size="sm" to="/payments/new">
              + Record
            </Button>
          </>
        }
      />
      <FilterChips<PaymentFilter> options={chipOptions} value={filter} onChange={setFilter} />
      {toastMessage ? <Toast message={toastMessage} onDismiss={dismissToast} /> : null}
      {actionError ? <AlertBanner variant="danger" title={actionError} /> : null}
      <Button variant="secondary" fullWidth className={styles.mobileOnly} to="/cycles/new">
        Set up recurring dues
      </Button>
      {rows.length === 0 ? (
        <EmptyState title="No payments here" subtitle="Try another filter." />
      ) : (
        <div className={styles.list}>
          <div className={styles.headRow} aria-hidden="true">
            <span>Apartment</span>
            <span>Payment</span>
            <span>Amount</span>
            <span>Status</span>
            <span />
          </div>
          {rows.map((row) => (
            <div key={row.payment.id} className={styles.row}>
              <span className={styles.aptCell}>{row.apartmentLabel}</span>
              <span className={styles.info}>
                <span className={styles.title}>
                  <span className={styles.aptInline}>{row.apartmentLabel} · </span>
                  {row.payment.label}
                </span>
                <span className={styles.sub}>
                  {row.payment.apartmentOwner} · {paymentDateText(row.payment, row.status)}
                </span>
              </span>
              <span className={`${styles.amount} tnum`}>
                {formatCurrency(row.payment.amount)}
              </span>
              <span className={styles.status}>
                <StatusBadge status={row.status}>{statusLabels[row.status]}</StatusBadge>
              </span>
              <span className={styles.action}>
                {row.status !== "paid" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className={styles.markButton}
                    onClick={() => requestMarkAsPaid(row.payment, row.apartmentLabel)}
                  >
                    Mark as paid
                  </Button>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <ConfirmDialog
        open={isConfirmOpen}
        title={confirmTitle}
        subtitle={confirmSubtitle}
        confirmLabel="Yes, mark as paid"
        busy={isMarking}
        onConfirm={() => void confirmMarkAsPaid()}
        onCancel={cancelMarkAsPaid}
      />
    </div>
  );
}
