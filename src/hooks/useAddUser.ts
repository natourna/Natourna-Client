import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import type { UserRole } from "../types/user";
import { toErrorMessage, userService } from "../services";
import { toFieldErrors, type FieldErrors } from "../utils/formErrors";

const addUserSchema = z.object({
  email: z.email("Enter a valid email address."),
  phoneNumber: z.string().min(1, "Enter a phone number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["User", "Admin"]),
});

type AddUserValues = z.infer<typeof addUserSchema>;

export function useAddUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("User");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<AddUserValues>>({});

  const isValid = addUserSchema.safeParse({
    email: email.trim(),
    phoneNumber: phoneNumber.trim(),
    password,
    role,
  }).success;

  const submit = async () => {
    const parsed = addUserSchema.safeParse({
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      password,
      role,
    });
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
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
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    role,
    setRole,
    isValid,
    isSubmitting,
    submitError,
    fieldErrors,
    submit,
  };
}
