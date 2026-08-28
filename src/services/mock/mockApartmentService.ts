import type { ApartmentService } from "../apartmentService";
import { clone, db, delay, findOrFail } from "./database";
import { nextId } from "./database";

export const mockApartmentService: ApartmentService = {
  async getApartments() {
    await delay();
    return clone(db.apartments);
  },

  async getApartmentById(id) {
    await delay();
    return clone(findOrFail(db.apartments, id, "Apartment"));
  },

  async createApartment(input) {
    await delay();
    const building = findOrFail(db.buildings, input.buildingId, "Building");
    const apartment = { id: nextId("apt"), buildingName: building.name, ...input };
    db.apartments.push(apartment);
    return clone(apartment);
  },

  async updateApartment(id, input) {
    await delay();
    const apartment = findOrFail(db.apartments, id, "Apartment");
    const building = findOrFail(db.buildings, input.buildingId, "Building");
    Object.assign(apartment, input, { buildingName: building.name });
    return clone(apartment);
  },
};
