import type { PaymentRow } from "../../../hooks/usePayments";
import { formatCurrency } from "../../../utils/currency";
import { paymentDateText, statusLabels } from "../../../utils/paymentStatus";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { EmptyState } from "../../ui/StateViews";
import { StatusBadge } from "../../ui/StatusBadge";
import styles from "./PaymentHistoryList.module.css";

interface PaymentHistoryListProps {
  rows: PaymentRow[];
  onMarkAsPaid?(row: PaymentRow): void;
}

export function PaymentHistoryList({ rows, onMarkAsPaid }: PaymentHistoryListProps) {
  if (rows.length === 0) {
    return <EmptyState title="No payments yet" subtitle="Payments will show up here." />;
  }

  return (
    <Card className={styles.card}>
      {rows.map((row) => (
        <div key={row.payment.id} className={styles.row}>
          <div className={styles.main}>
            <div className={styles.text}>
              <div className={styles.title}>{row.payment.label}</div>
              <div className={styles.subtitle}>{paymentDateText(row.payment, row.status)}</div>
            </div>
            <div className={`${styles.amount} tnum`}>{formatCurrency(row.payment.amount)}</div>
            <StatusBadge status={row.status}>{statusLabels[row.status]}</StatusBadge>
          </div>
          {onMarkAsPaid && row.status !== "paid" ? (
            <Button variant="outline" fullWidth onClick={() => onMarkAsPaid(row)}>
              Mark as paid
            </Button>
          ) : null}
        </div>
      ))}
    </Card>
  );
}
