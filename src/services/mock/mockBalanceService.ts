import type { BalanceService } from "../balanceService";
import { clone, db, delay } from "./database";

export const mockBalanceService: BalanceService = {
  async getBalances() {
    await delay();
    return clone(db.balances);
  },
};
