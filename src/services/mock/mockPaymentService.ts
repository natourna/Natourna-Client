import type { PaymentService } from "../paymentService";
import { AppError } from "../appError";
import { percentageOf, totalPercentage } from "../../utils/percentage";
import { todayIso } from "../../utils/date";
import { clone, db, delay, findOrFail, nextId } from "./database";

export const mockPaymentService: PaymentService = {
  async getPayments() {
    await delay();
    return clone(db.payments);
  },

  async getPaymentsByApartment(apartmentId) {
    await delay();
    return clone(db.payments.filter((payment) => payment.apartmentId === apartmentId));
  },

  async createPayment(input) {
    await delay();
    if (totalPercentage(input.allocations.map((allocation) => allocation.percentage)) !== 100) {
      throw new AppError("The fund split must add up to 100%.", 422);
    }
    const apartment = findOrFail(db.apartments, input.apartmentId, "Apartment");
    const payment = {
      id: nextId("payment"),
      label: input.label,
      amount: input.amount,
      paymentDate: null,
      dueDate: input.dueDate,
      isPaid: false,
      apartmentId: apartment.id,
      apartmentOwner: apartment.owner,
      apartmentTenant: apartment.tenant,
      cycleId: null,
      cycleName: null,
      recurrent: false,
      allocations: input.allocations.map((allocation) => ({
        ...allocation,
        allocatedAmount: percentageOf(input.amount, allocation.percentage),
      })),
    };
    db.payments.push(payment);
    return clone(payment);
  },

  async markPaymentAsPaid(id) {
    await delay();
    const payment = findOrFail(db.payments, id, "Payment");
    if (payment.isPaid) throw new AppError("This payment is already marked as paid.", 409);
    payment.isPaid = true;
    payment.paymentDate = todayIso();
    for (const allocation of payment.allocations) {
      const balance = findOrFail(db.balances, allocation.balanceId, "Fund");
      balance.currentAmount += allocation.allocatedAmount;
    }
    return clone(payment);
  },
};
