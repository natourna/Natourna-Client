import type { z } from "zod";
import type { apartmentInputSchema, apartmentSchema } from "../schemas/apartment";

export type Apartment = z.infer<typeof apartmentSchema>;

export type ApartmentInput = z.infer<typeof apartmentInputSchema>;
