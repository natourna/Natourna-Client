import { z } from "zod";
import { compoundSchema } from "../../schemas/compound";
import { AppError } from "../appError";
import type { CompoundService } from "../compoundService";
import { request } from "./httpClient";

export const httpCompoundService: CompoundService = {
  async getCompound() {
    const compounds = await request("/Compound", { schema: z.array(compoundSchema) });
    const compound = compounds[0];
    if (!compound) {
      throw new AppError("No compound has been set up yet.", 404);
    }
    return compound;
  },
};
