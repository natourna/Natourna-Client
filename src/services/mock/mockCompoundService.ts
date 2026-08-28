import type { CompoundService } from "../compoundService";
import { clone, db, delay } from "./database";

export const mockCompoundService: CompoundService = {
  async getCompound() {
    await delay();
    return clone({
      ...db.compound,
      activeApartments: db.apartments.filter((apartment) => apartment.isActive).length,
    });
  },
};
