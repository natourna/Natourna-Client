import { z } from "zod";
import type { CompoundService } from "../compoundService";
import { AppError } from "../appError";
import { request } from "../http";
import { compoundSchema } from "./schemas";

export const apiCompoundService: CompoundService = {
  async getCompound() {
    const compounds = await request("/Compound", z.array(compoundSchema));
    const compound = compounds[0];
    if (!compound) {
      throw new AppError("No compound is configured yet.", 404);
    }
    return compound;
  },
};
