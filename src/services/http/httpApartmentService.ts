import { apartmentSchema } from "../../schemas/apartment";
import { pagedSchema } from "../../schemas/common";
import type { ApartmentInput } from "../../types/apartment";
import type { ApartmentListParams, ApartmentService } from "../apartmentService";
import { fetchAllPages } from "./fetchAllPages";
import { request } from "./httpClient";

const pagedApartmentsSchema = pagedSchema(apartmentSchema);

function toApartmentRequest(input: ApartmentInput) {
  return {
    apartmentInfo: input.apartmentInfo,
    owner: input.owner,
    tenant: input.tenant,
    isActive: input.isActive,
    floor: input.floor,
    buildingId: Number(input.buildingId),
  };
}

export const httpApartmentService: ApartmentService = {
  getApartments(params: ApartmentListParams) {
    return request("/Apartment", {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
      },
      schema: pagedApartmentsSchema,
    });
  },

  getAllApartments() {
    return fetchAllPages((page, pageSize) =>
      httpApartmentService.getApartments({ page, pageSize }),
    );
  },

  getApartmentById(id: string) {
    return request(`/Apartment/${id}`, { schema: apartmentSchema });
  },

  createApartment(input: ApartmentInput) {
    return request("/Apartment", {
      method: "POST",
      body: toApartmentRequest(input),
      schema: apartmentSchema,
    });
  },

  updateApartment(id: string, input: ApartmentInput) {
    return request(`/Apartment/${id}`, {
      method: "PUT",
      body: toApartmentRequest(input),
      schema: apartmentSchema,
    });
  },
};
