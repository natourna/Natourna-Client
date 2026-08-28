import type { ApartmentInput } from "../../types/apartment";
import type { ApartmentService } from "../apartmentService";
import { request } from "../http";
import { fetchAllPages } from "./paged";
import { apartmentSchema, pagedSchema } from "./schemas";

const pagedApartmentsSchema = pagedSchema(apartmentSchema);

function toApartmentRequest(input: ApartmentInput) {
  return {
    apartmentInfo: input.apartmentInfo,
    owner: input.owner || null,
    tenant: input.tenant,
    isActive: input.isActive,
    floor: Number.parseInt(input.floor, 10) || 0,
    buildingId: Number(input.buildingId),
  };
}

export const apiApartmentService: ApartmentService = {
  getApartments() {
    return fetchAllPages((page, pageSize) => request("/Apartment", pagedApartmentsSchema, { query: { page, pageSize } }));
  },

  getApartmentById(id) {
    return request(`/Apartment/${id}`, apartmentSchema);
  },

  createApartment(input) {
    return request("/Apartment", apartmentSchema, { method: "POST", body: toApartmentRequest(input) });
  },

  updateApartment(id, input) {
    return request(`/Apartment/${id}`, apartmentSchema, { method: "PUT", body: toApartmentRequest(input) });
  },
};
