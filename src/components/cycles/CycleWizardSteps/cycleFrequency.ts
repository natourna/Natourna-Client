import type { PaymentCycle } from "../../../types/cycle";

export const frequencyOptions: { value: PaymentCycle; label: string }[] = [
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "SemiAnnual", label: "Twice a year" },
  { value: "Annual", label: "Yearly" },
  { value: "OneTime", label: "Just once" },
];

export const frequencyPhrases: Record<PaymentCycle, string> = {
  Weekly: "each week",
  Monthly: "each month",
  Quarterly: "every quarter",
  SemiAnnual: "twice a year",
  Annual: "each year",
  OneTime: "once",
};

export function frequencyLabel(paymentCycle: PaymentCycle): string {
  return frequencyOptions.find((option) => option.value === paymentCycle)?.label ?? "";
}
