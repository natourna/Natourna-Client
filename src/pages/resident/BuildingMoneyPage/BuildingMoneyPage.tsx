import { Card } from "../../../components/ui/Card";
import { ListRow } from "../../../components/ui/ListRow";
import { PageHeader } from "../../../components/ui/PageHeader";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useBuildingMoney } from "../../../hooks/useBuildingMoney";
import { formatCurrency, formatSignedCurrency } from "../../../utils/currency";
import { currentMonthLabel, formatShortDate } from "../../../utils/date";
import styles from "./BuildingMoneyPage.module.css";

export function BuildingMoneyPage() {
  const { buildingMoney, isLoading, error, reload } = useBuildingMoney();

  if (isLoading) return <LoadingState />;
  if (error || !buildingMoney) {
    return <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />;
  }

  const { compound, balances, totalFunds, dues, recentExpenses } = buildingMoney;

  return (
    <div className="page">
      <PageHeader
        title="Building money"
        subtitle={`${compound.name} · updated ${formatShortDate(new Date().toISOString())}`}
      />
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.totalCard}>
            <div className={styles.totalLabel}>All funds together</div>
            <div className={`${styles.totalAmount} tnum`}>{formatCurrency(totalFunds)}</div>
          </div>
          <div className={styles.fundList}>
            {balances.map((balance) => (
              <div key={balance.id} className={styles.fundRow}>
                <span className={styles.fundName}>{balance.label}</span>
                <span className={`${styles.fundAmount} tnum`}>
                  {formatCurrency(balance.currentAmount)}
                </span>
              </div>
            ))}
          </div>
          <Card className={styles.duesCard}>
            <div className={styles.duesTitle}>{currentMonthLabel()} dues, building-wide</div>
            <ProgressBar value={dues.collected} max={dues.expected} label="Dues collected" />
            <div className={styles.duesNote}>
              {formatCurrency(dues.collected)} collected of {formatCurrency(dues.expected)} ·{" "}
              {dues.paidApartments} of {dues.totalApartments} apartments
            </div>
          </Card>
        </div>
        <div className={styles.column}>
          <h2 className={styles.sectionTitle}>Recent expenses</h2>
          <Card className={styles.expensesCard}>
            {recentExpenses.map((bill) => (
              <ListRow
                key={bill.id}
                title={<span className={styles.expenseLabel}>{bill.label}</span>}
                subtitle={`${bill.balanceName} · ${bill.paymentDate ? formatShortDate(bill.paymentDate) : ""}`}
                trailing={
                  <span className={`${styles.expenseAmount} tnum`}>
                    {formatSignedCurrency(-bill.amount)}
                  </span>
                }
              />
            ))}
          </Card>
        </div>
      </div>
      <div className={styles.footerNote}>
        Your committee updates this page.
        <br />
        Every payment and bill is listed here.
      </div>
    </div>
  );
}
