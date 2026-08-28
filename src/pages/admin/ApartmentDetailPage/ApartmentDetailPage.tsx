import { useParams } from "react-router-dom";
import { PaymentHistoryList } from "../../../components/payments/PaymentHistoryList";
import { AlertBanner } from "../../../components/ui/AlertBanner";
import { BackLink } from "../../../components/ui/BackLink";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { Toast } from "../../../components/ui/Toast";
import { useApartmentDetail } from "../../../hooks/useApartmentDetail";
import { formatCurrency } from "../../../utils/currency";
import { apartmentStandingLabel } from "../../../utils/paymentStatus";
import styles from "./ApartmentDetailPage.module.css";

export function ApartmentDetailPage() {
  const { apartmentId = "" } = useParams();
  const {
    detail,
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
  } = useApartmentDetail(apartmentId);

  if (isLoading) return <LoadingState />;
  if (error || !detail) return <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />;

  const { apartment, rows, status, outstanding } = detail;

  return (
    <div className={`page ${styles.page}`}>
      <BackLink to="/apartments" label="All apartments" />
      <Card className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <div className={styles.summaryText}>
            <h1 className={styles.title}>{apartment.apartmentInfo}</h1>
            <div className={styles.subtitle}>
              {apartment.floor} · {apartment.buildingName} ·{" "}
              {apartment.isActive ? "Active" : "Inactive"}
            </div>
          </div>
          <StatusBadge status={status}>
            {apartmentStandingLabel(status, formatCurrency(outstanding))}
          </StatusBadge>
        </div>
        <div className={styles.facts}>
          <div className={styles.fact}>
            <span className={styles.factLabel}>Owner</span>
            <strong>{apartment.owner}</strong>
          </div>
          <div className={styles.fact}>
            <span className={styles.factLabel}>Tenant</span>
            <strong>{apartment.tenant ?? "—"}</strong>
          </div>
          <div className={styles.fact}>
            <span className={styles.factLabel}>Building</span>
            <strong>{apartment.buildingName}</strong>
          </div>
        </div>
      </Card>
      {toastMessage ? <Toast message={toastMessage} onDismiss={dismissToast} /> : null}
      {actionError ? <AlertBanner variant="danger" title={actionError} /> : null}
      <h2 className={styles.sectionTitle}>Payments</h2>
      <PaymentHistoryList
        rows={rows}
        onMarkAsPaid={(row) => requestMarkAsPaid(row.payment, row.apartmentLabel)}
      />
      <Button variant="secondary" fullWidth className={styles.editButton} to={`/apartments/${apartment.id}/edit`}>
        Edit apartment details
      </Button>
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
