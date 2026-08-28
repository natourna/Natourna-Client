import { z } from "zod";
import type { BalanceService } from "../balanceService";
import { request } from "../http";
import { balanceSchema } from "./schemas";

export const apiBalanceService: BalanceService = {
  getBalances() {
    return request("/Balance", z.array(balanceSchema));
  },
};
