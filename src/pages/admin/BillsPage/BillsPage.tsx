import { AlertBanner } from "../../../components/ui/AlertBanner";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PageHeader } from "../../../components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Toast } from "../../../components/ui/Toast";
import { useBills } from "../../../hooks/useBills";
import { formatCurrency } from "../../../utils/currency";
import { paymentDateText, statusLabels } from "../../../utils/paymentStatus";
import styles from "./BillsPage.module.css";

export function BillsPage() {
  const {
    rows,
    isLoading,
    error,
    reload,
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
  } = useBills();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="page">
      <PageHeader
        title="Bills"
        subtitle="What the building pays out"
        actions={
          <Button size="sm" to="/bills/new">
            + Add a bill
          </Button>
        }
      />
      {toastMessage ? <Toast message={toastMessage} onDismiss={dismissToast} /> : null}
      {actionError ? <AlertBanner variant="danger" title={actionError} /> : null}
      {rows.length === 0 ? (
        <EmptyState title="No bills yet" subtitle="Add a bill to track what the building pays." />
      ) : (
        <div className={styles.list}>
          {rows.map((row) => (
            <div key={row.bill.id} className={styles.card}>
              <div className={styles.main}>
                <div className={styles.info}>
                  <div className={styles.title}>{row.bill.label}</div>
                  <div className={styles.sub}>
                    from {row.bill.balanceName} · {paymentDateText(row.bill, row.status)}
                  </div>
                </div>
                <div className={styles.trailing}>
                  <div className={`${styles.amount} tnum`}>{formatCurrency(row.bill.amount)}</div>
                  <StatusBadge status={row.status}>{statusLabels[row.status]}</StatusBadge>
                </div>
              </div>
              {row.remainingAfter !== null ? (
                <div className={styles.note}>
                  Paying this leaves <strong className="tnum">{formatCurrency(row.remainingAfter)}</strong>{" "}
                  in the {row.bill.balanceName}.
                </div>
              ) : null}
              {row.status !== "paid" ? (
                <Button variant="outline" fullWidth onClick={() => requestMarkAsPaid(row.bill)}>
                  Mark as paid
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
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
