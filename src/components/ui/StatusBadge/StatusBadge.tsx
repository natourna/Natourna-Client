import type { ReactNode } from "react";
import type { PaymentStatus } from "../../../utils/paymentStatus";
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "../Icons";
import styles from "./StatusBadge.module.css";

const icons: Record<PaymentStatus, typeof CheckCircleIcon> = {
  paid: CheckCircleIcon,
  due: ClockIcon,
  overdue: AlertTriangleIcon,
};

interface StatusBadgeProps {
  status: PaymentStatus;
  children: ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const Icon = icons[status];
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <Icon size={15} strokeWidth={2.5} />
      {children}
    </span>
  );
}
