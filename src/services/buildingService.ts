import type { Building } from "../types/building";

export interface BuildingService {
  getBuildings(): Promise<Building[]>;
}
