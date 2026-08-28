import { z } from "zod";

export const idSchema = z.number().int().transform(String);

export const nullableIdSchema = z
  .number()
  .int()
  .nullable()
  .transform((value) => (value === null ? null : String(value)));

export const dateOnlySchema = z.string().transform((value) => value.slice(0, 10));

export const requiredDateOnlySchema = z
  .string()
  .nullable()
  .transform((value) => (value ? value.slice(0, 10) : ""));

export const nullableDateOnlySchema = z
  .string()
  .nullable()
  .transform((value) => (value ? value.slice(0, 10) : null));

export const fallbackTextSchema = z
  .string()
  .nullable()
  .transform((value) => value ?? "");

export function pagedSchema<Item extends z.ZodType>(item: Item) {
  return z.object({
    items: z.array(item),
    page: z.number().int(),
    pageSize: z.number().int(),
    totalCount: z.number().int(),
  });
}
