import type { Apartment, ApartmentInput } from "../types/apartment";

export interface ApartmentService {
  getApartments(): Promise<Apartment[]>;
  getApartmentById(id: string): Promise<Apartment>;
  createApartment(input: ApartmentInput): Promise<Apartment>;
  updateApartment(id: string, input: ApartmentInput): Promise<Apartment>;
}
