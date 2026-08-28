import type { BillService } from "../billService";
import { AppError } from "../appError";
import { formatCurrency } from "../../utils/currency";
import { todayIso } from "../../utils/date";
import { clone, db, delay, findOrFail, nextId } from "./database";

export const mockBillService: BillService = {
  async getBills() {
    await delay();
    return clone(db.bills);
  },

  async createBill(input) {
    await delay();
    const balance = findOrFail(db.balances, input.balanceId, "Fund");
    if (balance.currentAmount < input.amount) {
      throw new AppError(
        `The ${balance.label} only has ${formatCurrency(balance.currentAmount)} — this bill is ${formatCurrency(input.amount)}.`,
        422,
      );
    }
    const bill = {
      id: nextId("bill"),
      isPaid: false,
      paymentDate: null,
      balanceName: balance.label,
      ...input,
    };
    db.bills.push(bill);
    return clone(bill);
  },

  async markBillAsPaid(id) {
    await delay();
    const bill = findOrFail(db.bills, id, "Bill");
    if (bill.isPaid) throw new AppError("This bill is already marked as paid.", 409);
    const balance = findOrFail(db.balances, bill.balanceId, "Fund");
    if (balance.currentAmount < bill.amount) {
      throw new AppError(
        `The ${balance.label} only has ${formatCurrency(balance.currentAmount)} — this bill is ${formatCurrency(bill.amount)}.`,
        422,
      );
    }
    bill.isPaid = true;
    bill.paymentDate = todayIso();
    balance.currentAmount -= bill.amount;
    return clone(bill);
  },
};
