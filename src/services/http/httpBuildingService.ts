import { z } from "zod";
import { buildingSchema } from "../../schemas/building";
import type { BuildingService } from "../buildingService";
import { request } from "./httpClient";

export const httpBuildingService: BuildingService = {
  getBuildings() {
    return request("/Building", { schema: z.array(buildingSchema) });
  },
};
