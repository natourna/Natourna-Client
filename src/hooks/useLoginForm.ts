import { useState } from "react";
import { useAuth } from "./useAuth";
import { toErrorMessage } from "../services";

export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (email.trim() === "" || password === "") {
      setError("Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await login(email, password);
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
