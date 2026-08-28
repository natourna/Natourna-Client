import { z } from "zod";
import type { CycleService } from "../cycleService";
import { request } from "../http";
import { cycleSchema, paymentCycleNumbers } from "./schemas";

export const apiCycleService: CycleService = {
  async getActiveCycle() {
    const cycles = await request("/Cycle", z.array(cycleSchema));
    return cycles.find((cycle) => cycle.isActive) ?? null;
  },

  createCycle(input) {
    return request("/Cycle", cycleSchema, {
      method: "POST",
      body: {
        label: input.label,
        cycle: paymentCycleNumbers[input.paymentCycle],
        startDate: input.startDate,
        endDate: input.endDate,
        apartmentIds: input.apartmentIds.map(Number),
        amount: input.amount,
        balanceAllocations: input.balanceAllocations.map((allocation) => ({
          balanceId: Number(allocation.balanceId),
          percentage: allocation.percentage,
        })),
      },
    });
  },
};
