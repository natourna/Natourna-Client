import type { Balance } from "../types/balance";

export interface BalanceService {
  getBalances(): Promise<Balance[]>;
}
