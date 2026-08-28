import type { BuildingService } from "../buildingService";
import { clone, db, delay } from "./database";

export const mockBuildingService: BuildingService = {
  async getBuildings() {
    await delay();
    return clone(db.buildings);
  },
};
