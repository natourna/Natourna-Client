export interface Apartment {
  id: string;
  apartmentInfo: string;
  owner: string;
  tenant: string | null;
  isActive: boolean;
  floor: string;
  buildingId: string;
  buildingName: string;
}

export type ApartmentInput = Omit<Apartment, "id" | "buildingName">;
