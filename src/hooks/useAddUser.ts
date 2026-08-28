import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../types/user";
import { userInputSchema } from "../schemas/user";
import { toErrorMessage, userService } from "../services";

export function useAddUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRole>("User");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const parsed = userInputSchema.safeParse({
    email: email.trim(),
    password,
    phoneNumber,
    role,
  });

  const isValid = parsed.success;

  const submit = async () => {
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await userService.createUser(parsed.data);
      navigate("/people");
    } catch (cause) {
      setSubmitError(toErrorMessage(cause));
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    phoneNumber,
    setPhoneNumber,
    role,
    setRole,
    isValid,
    isSubmitting,
    submitError,
    submit,
  };
}
