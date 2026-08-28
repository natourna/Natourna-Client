import type { z } from "zod";
import type { buildingSchema } from "../schemas/building";

export type Building = z.infer<typeof buildingSchema>;
