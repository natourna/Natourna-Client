import { useParams } from "react-router-dom";
import { AlertBanner } from "../../../components/ui/AlertBanner";
import { BackLink } from "../../../components/ui/BackLink";
import { Button } from "../../../components/ui/Button";
import { SelectField, TextField } from "../../../components/ui/FormField";
import { ErrorState, LoadingState } from "../../../components/ui/StateViews";
import { useApartmentForm } from "../../../hooks/useApartmentForm";
import styles from "./ApartmentFormPage.module.css";

export function ApartmentFormPage() {
  const { apartmentId } = useParams();
  const form = useApartmentForm(apartmentId ?? null);

  if (form.isLoading) return <LoadingState />;
  if (form.error) return <ErrorState message={form.error} onRetry={form.reload} />;

  const backTo = form.isEditing ? `/apartments/${apartmentId}` : "/apartments";

  return (
    <div className={`page ${styles.page}`}>
      <BackLink to={backTo} label={form.isEditing ? form.apartmentInfo : "Apartments"} />
      <h1 className={styles.title}>
        {form.isEditing ? "Edit apartment details" : "Add an apartment"}
      </h1>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
      >
        <TextField
          label="Apartment name"
          value={form.apartmentInfo}
          onChange={form.setApartmentInfo}
          placeholder="A-3"
          error={form.fieldErrors.apartmentInfo}
        />
        <TextField
          label="Floor"
          inputMode="numeric"
          value={form.floor}
          onChange={form.setFloor}
          placeholder="3"
          error={form.fieldErrors.floor}
        />
        <SelectField
          label="Building"
          value={form.buildingId}
          onChange={form.setBuildingId}
          placeholder="Choose a building"
          options={form.buildings.map((building) => ({
            value: building.id,
            label: building.name,
          }))}
        />
        <TextField label="Owner" value={form.owner} onChange={form.setOwner} error={form.fieldErrors.owner} />
        <TextField
          label="Tenant (leave empty if none)"
          value={form.tenant}
          onChange={form.setTenant}
        />
        <label className={styles.activeRow}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={form.isActive}
            onChange={(event) => form.setIsActive(event.target.checked)}
          />
          This apartment is active
        </label>
        {form.submitError ? <AlertBanner variant="danger" title={form.submitError} /> : null}
        <Button type="submit" size="lg" fullWidth disabled={!form.isValid || form.isSubmitting}>
          {form.isSubmitting ? "Saving…" : "Save apartment"}
        </Button>
      </form>
    </div>
  );
}
