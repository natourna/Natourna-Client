import { useState } from "react";
import { z } from "zod";
import { useAuth } from "./useAuth";
import { toErrorMessage } from "../services";
import { toFieldErrors, type FieldErrors } from "../utils/formErrors";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginValues>>({});

  const submit = async () => {
    const parsed = loginSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
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
    fieldErrors,
    submit,
  };
}
