import type { CycleService } from "../cycleService";
import { AppError } from "../appError";
import { percentageOf, totalPercentage } from "../../utils/percentage";
import { periodDueDates, scheduledPaymentLabel } from "../../utils/paymentSchedule";
import { clone, db, delay, findOrFail, nextId } from "./database";

export const mockCycleService: CycleService = {
  async getActiveCycle() {
    await delay();
    const active = db.cycles.find((cycle) => cycle.isActive);
    return active ? clone(active) : null;
  },

  async createCycle(input) {
    await delay();
    if (totalPercentage(input.balanceAllocations.map((allocation) => allocation.percentage)) !== 100) {
      throw new AppError("The fund split must add up to 100%.", 422);
    }
    if (input.apartmentIds.length === 0) {
      throw new AppError("Pick at least one apartment.", 422);
    }
    const dueDates = periodDueDates(input.paymentCycle, input.startDate, input.endDate);
    if (dueDates.length === 0) {
      throw new AppError("The dates don't allow any payments. Check the start and end.", 422);
    }
    const storedCycle = {
      id: nextId("cycle"),
      label: input.label,
      description: `${input.label} — every apartment`,
      paymentCycle: input.paymentCycle,
      startDate: input.startDate,
      endDate: input.endDate,
      amount: input.amount,
      isActive: true,
      balanceAllocations: input.balanceAllocations,
    };
    db.cycles.push(storedCycle);
    for (const apartmentId of input.apartmentIds) {
      const apartment = findOrFail(db.apartments, apartmentId, "Apartment");
      for (const dueDate of dueDates) {
        db.payments.push({
          id: nextId("payment"),
          label: scheduledPaymentLabel(input.paymentCycle, input.label, dueDate),
          amount: input.amount,
          paymentDate: null,
          dueDate,
          isPaid: false,
          apartmentId: apartment.id,
          apartmentOwner: apartment.owner,
          apartmentTenant: apartment.tenant,
          cycleId: storedCycle.id,
          cycleName: storedCycle.label,
          recurrent: input.paymentCycle !== "OneTime",
          allocations: input.balanceAllocations.map((allocation) => ({
            ...allocation,
            allocatedAmount: percentageOf(input.amount, allocation.percentage),
          })),
        });
      }
    }
    return clone(storedCycle);
  },
};
