import { Card } from "../../../components/ui/Card";
import { ListRow } from "../../../components/ui/ListRow";
import { PageHeader } from "../../../components/ui/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useFunds } from "../../../hooks/useFunds";
import { formatCurrency, formatSignedCurrency } from "../../../utils/currency";
import { formatShortDate } from "../../../utils/date";
import styles from "./FundsPage.module.css";

export function FundsPage() {
  const { funds, totalFunds, isLoading, error, reload } = useFunds();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="page">
      <PageHeader
        title="Funds"
        actions={
          <span className={styles.total}>
            Total <strong className="tnum">{formatCurrency(totalFunds)}</strong>
          </span>
        }
      />
      {funds.length === 0 ? (
        <EmptyState title="No funds yet" />
      ) : (
        <div className={styles.grid}>
          {funds.map(({ balance, activity }) => (
            <Card key={balance.id} className={styles.fundCard}>
              <div className={styles.fundHeader}>
                <div className={styles.fundName}>{balance.label}</div>
                <div className={`${styles.fundAmount} tnum`}>
                  {formatCurrency(balance.currentAmount)}
                </div>
              </div>
              <div className={styles.activity}>
                {activity.length === 0 ? (
                  <div className={styles.noActivity}>No activity yet.</div>
                ) : (
                  activity.map((entry) => (
                    <ListRow
                      key={entry.id}
                      leading={
                        <span
                          className={`${styles.directionIcon} ${entry.direction === "in" ? styles.directionIn : styles.directionOut}`}
                          aria-hidden="true"
                        >
                          {entry.direction === "in" ? "+" : "−"}
                        </span>
                      }
                      title={<span className={styles.entryLabel}>{entry.label}</span>}
                      subtitle={formatShortDate(entry.date)}
                      trailing={
                        <span
                          className={`${styles.entryAmount} tnum ${entry.direction === "in" ? styles.amountIn : styles.amountOut}`}
                        >
                          {formatSignedCurrency(entry.direction === "in" ? entry.amount : -entry.amount)}
                        </span>
                      }
                    />
                  ))
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
