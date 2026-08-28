import type { Apartment } from "../../../types/apartment";
import { CheckIcon } from "../../ui/Icons";
import styles from "./CycleWizardSteps.module.css";

interface CycleApartmentsStepProps {
  apartments: Apartment[];
  selectedIds: string[];
  onToggle(id: string): void;
  onSelectAll(): void;
}

export function CycleApartmentsStep({
  apartments,
  selectedIds,
  onToggle,
  onSelectAll,
}: CycleApartmentsStepProps) {
  const allSelected = selectedIds.length === apartments.length;

  return (
    <div className={styles.stepBody}>
      <span className={styles.fieldLabel}>Which apartments?</span>
      <button
        type="button"
        className={`${styles.allRow} ${allSelected ? styles.allRowSelected : ""}`}
        onClick={onSelectAll}
      >
        <span className={`${styles.checkbox} ${allSelected ? styles.checkboxOn : ""}`}>
          {allSelected ? <CheckIcon size={17} /> : null}
        </span>
        <span className={styles.allLabel}>All apartments</span>
        <span className={styles.allCount}>
          {selectedIds.length} of {apartments.length}
        </span>
      </button>
      <div className={styles.apartmentList}>
        {apartments.map((apartment) => {
          const isSelected = selectedIds.includes(apartment.id);
          return (
            <button
              key={apartment.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              className={styles.apartmentRow}
              onClick={() => onToggle(apartment.id)}
            >
              <span className={`${styles.checkbox} ${isSelected ? styles.checkboxOn : ""}`}>
                {isSelected ? <CheckIcon size={15} /> : null}
              </span>
              {apartment.apartmentInfo} · {apartment.owner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
