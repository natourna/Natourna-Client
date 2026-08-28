import { AlertBanner } from "../../../components/ui/AlertBanner";
import { BackLink } from "../../../components/ui/BackLink";
import { Button } from "../../../components/ui/Button";
import { SelectField, TextField } from "../../../components/ui/FormField";
import { useAddUser } from "../../../hooks/useAddUser";
import type { UserRole } from "../../../types/user";
import styles from "./AddUserPage.module.css";

export function AddUserPage() {
  const form = useAddUser();

  return (
    <div className={`page ${styles.page}`}>
      <BackLink to="/people" label="People" />
      <h1 className={styles.title}>Add a user</h1>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
      >
        <TextField label="Email" type="email" value={form.email} onChange={form.setEmail} />
        <TextField
          label="Phone number"
          type="tel"
          value={form.phoneNumber}
          onChange={form.setPhoneNumber}
          placeholder="03 123 456"
        />
        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={form.setPassword}
          placeholder="At least 8 characters"
        />
        <SelectField
          label="Role"
          value={form.role}
          onChange={(value) => form.setRole(value as UserRole)}
          options={[
            { value: "User", label: "Resident" },
            { value: "Admin", label: "Admin" },
          ]}
        />
        {form.submitError ? <AlertBanner variant="danger" title={form.submitError} /> : null}
        <Button type="submit" size="lg" fullWidth disabled={!form.isValid || form.isSubmitting}>
          {form.isSubmitting ? "Saving…" : "Add user"}
        </Button>
      </form>
    </div>
  );
}
