import type { Compound } from "../types/compound";

export interface CompoundService {
  getCompound(): Promise<Compound>;
}
