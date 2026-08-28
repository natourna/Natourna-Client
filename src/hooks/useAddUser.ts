import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../types/user";
import { toErrorMessage, userService } from "../services";

export function useAddUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("User");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isValid = email.trim().includes("@") && phoneNumber.trim() !== "" && password.length >= 8;

  const submit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await userService.createUser({
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        role,
      });
      navigate("/people");
    } catch (cause) {
      setSubmitError(toErrorMessage(cause));
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    role,
    setRole,
    isValid,
    isSubmitting,
    submitError,
    submit,
  };
}
