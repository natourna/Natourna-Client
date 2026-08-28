import type { Apartment } from "../../types/apartment";
import type { Balance } from "../../types/balance";
import type { Bill } from "../../types/bill";
import type { Building } from "../../types/building";
import type { Compound } from "../../types/compound";
import type { Cycle } from "../../types/cycle";
import type { Payment } from "../../types/payment";
import type { User } from "../../types/user";
import { AppError } from "../appError";

const compound: Compound = {
  id: "compound-1",
  name: "Cedar Residence",
  address: "Mar Mikhael Street, Beirut",
  activeApartments: 9,
};

const buildings: Building[] = [
  { id: "building-a", name: "Block A", numberOfApartments: 5, floors: 5, compoundId: compound.id },
  { id: "building-b", name: "Block B", numberOfApartments: 4, floors: 4, compoundId: compound.id },
];

const apartments: Apartment[] = [
  { id: "apt-a1", apartmentInfo: "A-1", owner: "Nadia Aoun", tenant: null, isActive: true, floor: "Ground floor", buildingId: "building-a", buildingName: "Block A" },
  { id: "apt-a2", apartmentInfo: "A-2", owner: "Mona Saad", tenant: "Ali Hassan", isActive: true, floor: "1st floor", buildingId: "building-a", buildingName: "Block A" },
  { id: "apt-a3", apartmentInfo: "A-3", owner: "Georges Khoury", tenant: null, isActive: true, floor: "3rd floor", buildingId: "building-a", buildingName: "Block A" },
  { id: "apt-a4", apartmentInfo: "A-4", owner: "Karim Haddad", tenant: null, isActive: true, floor: "3rd floor", buildingId: "building-a", buildingName: "Block A" },
  { id: "apt-a5", apartmentInfo: "A-5", owner: "Layla Fares", tenant: null, isActive: true, floor: "4th floor", buildingId: "building-a", buildingName: "Block A" },
  { id: "apt-b1", apartmentInfo: "B-1", owner: "Samir Nassar", tenant: null, isActive: true, floor: "Ground floor", buildingId: "building-b", buildingName: "Block B" },
  { id: "apt-b2", apartmentInfo: "B-2", owner: "Hala Chami", tenant: null, isActive: true, floor: "2nd floor", buildingId: "building-b", buildingName: "Block B" },
  { id: "apt-b3", apartmentInfo: "B-3", owner: "Fouad Sleiman", tenant: null, isActive: true, floor: "2nd floor", buildingId: "building-b", buildingName: "Block B" },
  { id: "apt-b4", apartmentInfo: "B-4", owner: "Rita Gemayel", tenant: null, isActive: true, floor: "4th floor", buildingId: "building-b", buildingName: "Block B" },
];

const balances: Balance[] = [
  { id: "balance-maintenance", label: "Maintenance Fund", currentAmount: 2340, compoundId: compound.id },
  { id: "balance-generator", label: "Generator Fund", currentAmount: 1180, compoundId: compound.id },
  { id: "balance-cleaning", label: "Cleaning Fund", currentAmount: 460, compoundId: compound.id },
];

const cycles: Cycle[] = [
  {
    id: "cycle-2026",
    label: "2026 monthly dues",
    description: "$50 every month from every apartment",
    paymentCycle: "Monthly",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    amount: 50,
    isActive: true,
    balanceAllocations: [
      { balanceId: "balance-maintenance", percentage: 60 },
      { balanceId: "balance-generator", percentage: 40 },
    ],
  },
];

const seedMonths = [
  { label: "June dues", dueDate: "2026-06-30", paidDay: "2026-06" },
  { label: "July dues", dueDate: "2026-07-31", paidDay: "2026-07" },
  { label: "August dues", dueDate: "2026-08-31", paidDay: "2026-08" },
];

const unpaidSeed = new Set(["apt-a2:August dues", "apt-a3:August dues", "apt-b2:June dues", "apt-b2:August dues"]);

function seedPayments(): Payment[] {
  return apartments.flatMap((apartment, index) =>
    seedMonths.map((month) => {
      const isPaid = !unpaidSeed.has(`${apartment.id}:${month.label}`);
      return {
        id: `payment-${apartment.id}-${month.dueDate}`,
        label: month.label,
        amount: 50,
        paymentDate: isPaid ? `${month.paidDay}-0${(index % 7) + 2}` : null,
        dueDate: month.dueDate,
        isPaid,
        apartmentId: apartment.id,
        apartmentOwner: apartment.owner,
        apartmentTenant: apartment.tenant,
        cycleId: "cycle-2026",
        cycleName: "2026 monthly dues",
        recurrent: true,
        allocations: [
          { balanceId: "balance-maintenance", percentage: 60, allocatedAmount: 30 },
          { balanceId: "balance-generator", percentage: 40, allocatedAmount: 20 },
        ],
      };
    }),
  );
}

const bills: Bill[] = [
  { id: "bill-elevator", label: "Elevator repair", amount: 300, dueDate: "2026-09-05", isPaid: false, paymentDate: null, balanceId: "balance-maintenance", balanceName: "Maintenance Fund" },
  { id: "bill-diesel-aug", label: "Generator diesel — August", amount: 180, dueDate: "2026-08-10", isPaid: true, paymentDate: "2026-08-10", balanceId: "balance-generator", balanceName: "Generator Fund" },
  { id: "bill-cleaning-aug", label: "Stairwell cleaning — August", amount: 90, dueDate: "2026-08-08", isPaid: true, paymentDate: "2026-08-08", balanceId: "balance-cleaning", balanceName: "Cleaning Fund" },
  { id: "bill-water-pump", label: "Water pump service", amount: 120, dueDate: "2026-07-28", isPaid: true, paymentDate: "2026-07-28", balanceId: "balance-maintenance", balanceName: "Maintenance Fund" },
];

const users: User[] = [
  { id: "user-rima", email: "rima.saab@email.com", phoneNumber: "03 123 456", role: "Admin", isActive: true },
  { id: "user-georges", email: "georges.khoury@email.com", phoneNumber: "03 456 789", role: "User", isActive: true },
  { id: "user-mona", email: "mona.saad@email.com", phoneNumber: "03 789 123", role: "User", isActive: true },
  { id: "user-ali", email: "ali.hassan@email.com", phoneNumber: "03 321 654", role: "User", isActive: false },
];

export const db = {
  compound,
  buildings,
  apartments,
  balances,
  cycles,
  payments: seedPayments(),
  bills,
  users,
  currentUserId: null as string | null,
};

export function delay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 250));
}

export function clone<T>(value: T): T {
  return structuredClone(value);
}

export function findOrFail<T extends { id: string }>(items: T[], id: string, entityName: string): T {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new AppError(`${entityName} not found.`, 404);
  return item;
}

let idCounter = 0;

export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}
