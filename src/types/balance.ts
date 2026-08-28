import type { z } from "zod";
import type { balanceSchema } from "../schemas/balance";

export type Balance = z.infer<typeof balanceSchema>;
