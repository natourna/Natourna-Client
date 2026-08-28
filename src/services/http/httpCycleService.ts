import { cycleSchema } from "../../schemas/cycle";
import type { CycleInput } from "../../types/cycle";
import { AppError } from "../appError";
import type { CycleService } from "../cycleService";
import { request } from "./httpClient";

export const httpCycleService: CycleService = {
  async getActiveCycle() {
    try {
      return await request("/Cycle/active", { schema: cycleSchema });
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  createCycle(input: CycleInput) {
    return request("/Cycle", {
      method: "POST",
      body: {
        label: input.label,
        cycle: input.paymentCycle,
        startDate: input.startDate,
        endDate: input.endDate,
        amount: input.amount,
        balanceAllocations: input.balanceAllocations.map((allocation) => ({
          balanceId: Number(allocation.balanceId),
          percentage: allocation.percentage,
        })),
        apartmentIds: input.apartmentIds.map(Number),
      },
      schema: cycleSchema,
    });
  },
};
