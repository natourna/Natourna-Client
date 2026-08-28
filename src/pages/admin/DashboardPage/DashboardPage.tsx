import { Link } from "react-router-dom";
import { AlertBanner } from "../../../components/ui/AlertBanner";
import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { LogoutIcon, PlusIcon } from "../../../components/ui/Icons";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useAuth } from "../../../hooks/useAuth";
import { useDashboard } from "../../../hooks/useDashboard";
import { formatCurrency } from "../../../utils/currency";
import { currentMonthLabel, formatShortDate, formatWeekdayDate, greeting } from "../../../utils/date";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const { session, logout } = useAuth();
  const { dashboard, isLoading, error, reload } = useDashboard();
  const firstName = (session?.username ?? "").split(" ")[0];

  if (isLoading) return <LoadingState />;
  if (error || !dashboard) return <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />;

  const { compound, balances, totalFunds, overdueRows, unpaidBills, dues } = dashboard;
  const nextBill = unpaidBills[0] ?? null;
  const alertParts = [
    overdueRows.length > 0
      ? `${overdueRows.length} payment${overdueRows.length > 1 ? "s are" : " is"} overdue`
      : null,
    nextBill ? `the ${nextBill.label.toLowerCase()} is due ${formatShortDate(nextBill.dueDate)}` : null,
  ].filter(Boolean);

  return (
    <div className="page">
      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          <div className={styles.eyebrow}>{compound.name}</div>
          <h1 className={styles.title}>
            {greeting()}, {firstName}
          </h1>
          <div className={styles.subtitle}>{formatWeekdayDate(new Date())}</div>
        </div>
        <div className={styles.desktopActions}>
          <Button variant="secondary" to="/bills/new">
            Add a bill
          </Button>
          <Button to="/payments/new">
            <PlusIcon size={20} />
            Record a payment
          </Button>
        </div>
        <div className={styles.mobileTools}>
          <Link to="/people" aria-label="People">
            <Avatar name={session?.username ?? ""} tone="primary" size={44} />
          </Link>
          <button type="button" className={styles.logout} aria-label="Sign out" onClick={logout}>
            <LogoutIcon size={20} />
          </button>
        </div>
      </div>

      {alertParts.length > 0 ? (
        <AlertBanner variant="danger" title={`${alertParts.join(", and ")}.`} to="/payments" />
      ) : null}

      <div className={styles.fundsGrid}>
        <div className={styles.totalCard}>
          <div className={styles.totalLabel}>Total across all funds</div>
          <div className={`${styles.totalAmount} tnum`}>{formatCurrency(totalFunds)}</div>
        </div>
        {balances.map((balance) => (
          <Link key={balance.id} to="/funds" className={styles.fundCard}>
            <span className={styles.fundName}>{balance.label}</span>
            <span className={`${styles.fundAmount} tnum`}>
              {formatCurrency(balance.currentAmount)}
            </span>
            <span className={styles.fundLink}>See activity →</span>
          </Link>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <Card className={styles.duesCard}>
          <div className={styles.cardTitle}>{currentMonthLabel()} dues</div>
          <div className={styles.duesAmounts}>
            <span className={`${styles.duesCollected} tnum`}>{formatCurrency(dues.collected)}</span>
            <span className={styles.duesOf}>collected of {formatCurrency(dues.expected)}</span>
          </div>
          <ProgressBar value={dues.collected} max={dues.expected} label="Dues collected" />
          <div className={styles.duesNote}>
            {dues.paidApartments} of {dues.totalApartments} apartments have paid ·{" "}
            {formatCurrency(dues.stillOwed)} still owed
          </div>
          <Link to="/payments" className={styles.cardLink}>
            See who hasn't paid →
          </Link>
        </Card>
        <Card className={styles.attentionCard}>
          <div className={styles.cardTitle}>Needs your attention</div>
          {overdueRows.length === 0 && unpaidBills.length === 0 ? (
            <div className={styles.allClear}>Nothing right now — all caught up.</div>
          ) : null}
          {overdueRows.map((row) => (
            <div key={row.payment.id} className={`${styles.attentionItem} ${styles.attentionDanger}`}>
              <div className={styles.attentionText}>
                <div className={styles.attentionTitle}>
                  {row.apartmentLabel} · {row.payment.label}
                </div>
                <div className={styles.attentionSub}>
                  {row.payment.apartmentOwner} · was due {formatShortDate(row.payment.dueDate)}
                </div>
              </div>
              <div className={`${styles.attentionAmount} tnum`}>
                {formatCurrency(row.payment.amount)}
              </div>
            </div>
          ))}
          {unpaidBills.map((bill) => (
            <div key={bill.id} className={`${styles.attentionItem} ${styles.attentionWarning}`}>
              <div className={styles.attentionText}>
                <div className={styles.attentionTitle}>{bill.label}</div>
                <div className={styles.attentionSub}>
                  {bill.balanceName} · due {formatShortDate(bill.dueDate)}
                </div>
              </div>
              <div className={`${styles.attentionAmount} tnum`}>{formatCurrency(bill.amount)}</div>
            </div>
          ))}
          <Link to="/payments" className={`${styles.cardLink} ${styles.attentionLink}`}>
            See all payments →
          </Link>
        </Card>
      </div>

      <div className={styles.mobileActions}>
        <Button size="md" fullWidth to="/payments/new">
          <PlusIcon size={20} />
          Record a payment
        </Button>
        <div className={styles.mobileActionsRow}>
          <Button variant="secondary" fullWidth to="/bills/new">
            Add a bill
          </Button>
          <Button variant="secondary" fullWidth to="/apartments">
            View apartments
          </Button>
        </div>
      </div>
    </div>
  );
}
