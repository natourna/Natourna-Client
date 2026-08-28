import { useState } from "react";
import { loginInputSchema } from "../schemas/auth";
import { useAuth } from "./useAuth";
import { toErrorMessage } from "../services";

export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const parsed = loginInputSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await login(parsed.data.email, parsed.data.password);
    } catch (cause) {
      setError(toErrorMessage(cause));
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    submit,
  };
}
