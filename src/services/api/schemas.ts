import { z } from "zod";
import type { PaymentCycle } from "../../types/cycle";

const idToString = z.number().transform(String);
const nullableIdToString = z
  .number()
  .nullable()
  .transform((value) => (value === null ? null : String(value)));
const dateOnly = z.string().transform((value) => value.slice(0, 10));
const nullableDateOnly = z
  .string()
  .nullable()
  .transform((value) => (value ? value.slice(0, 10) : null));
const nullableToEmpty = z
  .string()
  .nullable()
  .transform((value) => value ?? "");

export function pagedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    page: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
  });
}

export const authSessionSchema = z.object({
  token: z.string(),
  username: z.string(),
  expiresAt: z.string(),
});

export const userSchema = z.object({
  id: idToString,
  email: z.string(),
  phoneNumber: z.string(),
  role: z.enum(["User", "Admin"]),
  isActive: z.boolean(),
});

export const userDetailSchema = userSchema.extend({
  roleId: z.number(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const compoundSchema = z.object({
  id: idToString,
  name: z.string(),
  address: z.string(),
  activeApartments: z.number(),
});

export const buildingSchema = z.object({
  id: idToString,
  name: nullableToEmpty,
  numberOfApartments: z.number(),
  floors: z.number(),
  compoundId: idToString,
});

export const balanceSchema = z.object({
  id: idToString,
  label: z.string(),
  currentAmount: z.number(),
  compoundId: idToString,
});

export const apartmentSchema = z.object({
  id: idToString,
  apartmentInfo: z.string(),
  owner: nullableToEmpty,
  tenant: z.string().nullable(),
  isActive: z
    .boolean()
    .nullable()
    .transform((value) => value ?? true),
  floor: z.number().transform(String),
  buildingId: idToString,
  buildingName: nullableToEmpty,
});

export const billSchema = z.object({
  id: idToString,
  label: nullableToEmpty,
  amount: z.number(),
  dueDate: nullableDateOnly.transform((value) => value ?? ""),
  isPaid: z.boolean(),
  paymentDate: nullableDateOnly,
  balanceId: idToString,
  balanceName: nullableToEmpty,
});

const paymentAllocationSchema = z.object({
  balanceId: idToString,
  percentage: z.number(),
  allocatedAmount: z.number(),
});

export const paymentSchema = z.object({
  id: idToString,
  label: nullableToEmpty,
  amount: z.number(),
  paymentDate: nullableDateOnly,
  dueDate: nullableDateOnly.transform((value) => value ?? ""),
  isPaid: z.boolean(),
  apartmentId: idToString,
  apartmentInfo: nullableToEmpty,
  apartmentOwner: nullableToEmpty,
  apartmentTenant: z.string().nullable(),
  cycleId: nullableIdToString,
  cycleName: z.string().nullable(),
  recurrent: z.boolean(),
  allocations: z
    .array(paymentAllocationSchema)
    .nullable()
    .transform((value) => value ?? []),
});

const paymentCycleValues = ["Weekly", "Monthly", "Quarterly", "SemiAnnual", "Annual", "OneTime"] as const;

const rawBalanceAllocationSchema = z
  .object({
    BalanceId: z.number().optional(),
    balanceId: z.number().optional(),
    Percentage: z.number().optional(),
    percentage: z.number().optional(),
  })
  .transform((value) => ({
    balanceId: String(value.BalanceId ?? value.balanceId ?? 0),
    percentage: value.Percentage ?? value.percentage ?? 0,
  }));

const balanceAllocationsJson = z
  .string()
  .nullable()
  .transform((value) => {
    if (!value) return [];
    try {
      return z.array(rawBalanceAllocationSchema).parse(JSON.parse(value));
    } catch {
      return [];
    }
  });

export const cycleSchema = z.object({
  id: idToString,
  label: nullableToEmpty,
  description: nullableToEmpty,
  paymentCycle: z
    .enum(paymentCycleValues)
    .nullable()
    .transform((value): PaymentCycle => value ?? "Monthly"),
  startDate: dateOnly,
  endDate: dateOnly,
  amount: z.number(),
  isActive: z.boolean(),
  balanceAllocations: balanceAllocationsJson,
});

export const paymentCycleNumbers: Record<PaymentCycle, number> = {
  Monthly: 0,
  Quarterly: 1,
  SemiAnnual: 2,
  Annual: 3,
  Weekly: 4,
  OneTime: 5,
};
