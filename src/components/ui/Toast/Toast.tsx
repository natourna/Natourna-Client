import { CheckCircleIcon } from "../Icons";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  onDismiss(): void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <button type="button" className={styles.toast} role="status" onClick={onDismiss}>
      <CheckCircleIcon size={24} strokeWidth={2.2} />
      <span className={styles.message}>{message}</span>
    </button>
  );
}
