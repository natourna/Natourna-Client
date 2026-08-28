import type { Cycle, CycleInput } from "../types/cycle";

export interface CycleService {
  getActiveCycle(): Promise<Cycle | null>;
  createCycle(input: CycleInput): Promise<Cycle>;
}
