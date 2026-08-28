import type { Apartment, ApartmentInput } from "../types/apartment";
import type { PagedResult } from "../types/paged";

export interface ApartmentService {
  getApartments(): Promise<Apartment[]>;
  getApartmentsPage(page: number, pageSize: number, search?: string): Promise<PagedResult<Apartment>>;
  getApartmentById(id: string): Promise<Apartment>;
  createApartment(input: ApartmentInput): Promise<Apartment>;
  updateApartment(id: string, input: ApartmentInput): Promise<Apartment>;
}
