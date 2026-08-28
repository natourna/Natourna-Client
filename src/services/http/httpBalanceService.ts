import { z } from "zod";
import { balanceSchema } from "../../schemas/balance";
import type { BalanceService } from "../balanceService";
import { request } from "./httpClient";

export const httpBalanceService: BalanceService = {
  getBalances() {
    return request("/Balance", { schema: z.array(balanceSchema) });
  },
};
