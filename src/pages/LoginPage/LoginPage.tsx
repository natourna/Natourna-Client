import { Brand } from "../../components/ui/Brand";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/FormField";
import { useLoginForm } from "../../hooks/useLoginForm";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const { email, setEmail, password, setPassword, isSubmitting, error, submit } = useLoginForm();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Brand size="lg" />
        <form
          className={styles.card}
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
          {error ? (
            <div className={styles.error} role="alert">
              {error}
            </div>
          ) : null}
          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <div className={styles.footer}>
          Don't have an account?
          <br />
          Ask your building committee to add you.
        </div>
      </div>
    </div>
  );
}
