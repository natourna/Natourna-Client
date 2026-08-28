import type { z } from "zod";
import type { compoundSchema } from "../schemas/compound";

export type Compound = z.infer<typeof compoundSchema>;
