import { z } from "zod";
import type { BuildingService } from "../buildingService";
import { request } from "../http";
import { buildingSchema } from "./schemas";

export const apiBuildingService: BuildingService = {
  getBuildings() {
    return request("/Building", z.array(buildingSchema));
  },
};
