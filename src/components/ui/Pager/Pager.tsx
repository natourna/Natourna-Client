import { Button } from "../Button";
import styles from "./Pager.module.css";

interface PagerProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange(page: number): void;
}

export function Pager({ page, pageSize, totalCount, onPageChange }: PagerProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pager}>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className={`${styles.info} tnum`}>
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
