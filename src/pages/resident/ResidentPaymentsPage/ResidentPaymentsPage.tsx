import { PaymentHistoryList } from "../../../components/payments/PaymentHistoryList";
import { PageHeader } from "../../../components/ui/PageHeader";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useResidentHome } from "../../../hooks/useResidentHome";
import styles from "./ResidentPaymentsPage.module.css";

export function ResidentPaymentsPage() {
  const { home, isLoading, error, reload } = useResidentHome();

  if (isLoading) return <LoadingState />;
  if (error || !home) return <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />;

  return (
    <div className={`page ${styles.page}`}>
      <PageHeader
        title="My payments"
        subtitle={
          home.apartment
            ? `${home.apartment.apartmentInfo} · ${home.apartment.buildingName}`
            : undefined
        }
      />
      <PaymentHistoryList rows={home.rows} />
    </div>
  );
}
