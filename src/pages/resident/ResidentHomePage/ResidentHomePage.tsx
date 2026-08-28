import { PaymentHistoryList } from "../../../components/payments/PaymentHistoryList";
import { Card } from "../../../components/ui/Card";
import { CheckIcon, LogoutIcon, WalletIcon } from "../../../components/ui/Icons";
import { ListRow } from "../../../components/ui/ListRow";
import { EmptyState, ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { useAuth } from "../../../hooks/useAuth";
import { useBuildingMoney } from "../../../hooks/useBuildingMoney";
import { useResidentHome } from "../../../hooks/useResidentHome";
import { formatCurrency, formatSignedCurrency } from "../../../utils/currency";
import { formatMonthYear, formatShortDate } from "../../../utils/date";
import { statusLabels } from "../../../utils/paymentStatus";
import styles from "./ResidentHomePage.module.css";

export function ResidentHomePage() {
  const { session, logout } = useAuth();
  const { home, isLoading, error, reload } = useResidentHome();
  const { buildingMoney } = useBuildingMoney();
  const firstName = (session?.username ?? "").split(" ")[0];

  if (isLoading) return <LoadingState />;
  if (error || !home) return <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />;

  return (
    <div className="page">
      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Hello, {firstName}</h1>
          {home.apartment ? (
            <div className={styles.subtitle}>
              Your apartment:{" "}
              <strong>
                {home.apartment.apartmentInfo} · {home.apartment.buildingName} ·{" "}
                {home.apartment.floor}
              </strong>
            </div>
          ) : null}
        </div>
        <button type="button" className={styles.logout} aria-label="Sign out" onClick={logout}>
          <LogoutIcon size={20} />
        </button>
      </div>

      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          {home.apartment === null ? (
            <EmptyState
              title="No apartment linked yet"
              subtitle="Ask your building committee to link your account."
            />
          ) : home.nextDue ? (
            <Card className={styles.oweCard}>
              <StatusBadge status={home.nextDue.status}>
                {statusLabels[home.nextDue.status]}
              </StatusBadge>
              <div className={styles.oweLabel}>You owe</div>
              <div className={`${styles.oweAmount} tnum`}>
                {formatCurrency(home.nextDue.payment.amount)}
              </div>
              <div className={styles.oweFor}>
                for {formatMonthYear(home.nextDue.payment.dueDate)} · due{" "}
                {formatShortDate(home.nextDue.payment.dueDate)}
              </div>
              <div className={styles.oweNote}>
                Hand it to your committee —
                <br />
                they will mark it paid here.
              </div>
            </Card>
          ) : (
            <Card className={styles.paidUpCard}>
              <div className={styles.paidUpCircle}>
                <CheckIcon size={52} strokeWidth={2.5} />
              </div>
              <div className={styles.paidUpTitle}>You're all paid up</div>
              <div className={styles.paidUpSubtitle}>Nothing to pay right now.</div>
            </Card>
          )}

          <h2 className={styles.sectionTitle}>Your payments</h2>
          <PaymentHistoryList rows={home.rows} />

          <Card className={styles.buildingLinkCard}>
            <ListRow
              to="/building"
              leading={
                <span className={styles.buildingIcon}>
                  <WalletIcon size={24} />
                </span>
              }
              title="Where the building's money goes"
              subtitle="Funds, bills and totals"
            />
          </Card>
        </div>

        {buildingMoney ? (
          <div className={styles.sideColumn}>
            <div className={styles.fundsCard}>
              <div className={styles.fundsLabel}>The building's funds</div>
              <div className={`${styles.fundsTotal} tnum`}>
                {formatCurrency(buildingMoney.totalFunds)}
              </div>
              <div className={styles.fundsList}>
                {buildingMoney.balances.map((balance) => (
                  <div key={balance.id} className={styles.fundsRow}>
                    <span className={styles.fundsName}>{balance.label}</span>
                    <strong className="tnum">{formatCurrency(balance.currentAmount)}</strong>
                  </div>
                ))}
              </div>
            </div>
            <Card className={styles.expensesCard}>
              <div className={styles.expensesTitle}>Recent expenses</div>
              {buildingMoney.recentExpenses.map((bill) => (
                <ListRow
                  key={bill.id}
                  title={<span className={styles.expenseLabel}>{bill.label}</span>}
                  subtitle={bill.paymentDate ? formatShortDate(bill.paymentDate) : ""}
                  trailing={
                    <span className={`${styles.expenseAmount} tnum`}>
                      {formatSignedCurrency(-bill.amount)}
                    </span>
                  }
                />
              ))}
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
