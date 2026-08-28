import type { Apartment, ApartmentInput } from "../types/apartment";
import type { Paged, PageParams } from "../types/paging";

export interface ApartmentListParams extends PageParams {
  search?: string;
}

export interface ApartmentService {
  getApartments(params: ApartmentListParams): Promise<Paged<Apartment>>;
  getAllApartments(): Promise<Apartment[]>;
  getApartmentById(id: string): Promise<Apartment>;
  createApartment(input: ApartmentInput): Promise<Apartment>;
  updateApartment(id: string, input: ApartmentInput): Promise<Apartment>;
}
