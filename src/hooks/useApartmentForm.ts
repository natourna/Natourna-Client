import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { apartmentService, buildingService, toErrorMessage } from "../services";
import { toFieldErrors, type FieldErrors } from "../utils/formErrors";
import { useAsyncData } from "./useAsyncData";

const apartmentFormSchema = z.object({
  apartmentInfo: z.string().min(1, "Enter the apartment info."),
  floor: z.string().regex(/^\d+$/, "Floor must be a number."),
  buildingId: z.string().min(1, "Choose a building."),
  owner: z.string().min(1, "Enter the owner's name."),
});

type ApartmentFormValues = z.infer<typeof apartmentFormSchema>;

export function useApartmentForm(apartmentId: string | null) {
  const navigate = useNavigate();

  const loader = useCallback(async () => {
    const [buildings, apartment] = await Promise.all([
      buildingService.getBuildings(),
      apartmentId ? apartmentService.getApartmentById(apartmentId) : Promise.resolve(null),
    ]);
    return { buildings, apartment };
  }, [apartmentId]);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const [apartmentInfo, setApartmentInfo] = useState("");
  const [floor, setFloor] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [owner, setOwner] = useState("");
  const [tenant, setTenant] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ApartmentFormValues>>({});

  useEffect(() => {
    if (!data?.apartment) return;
    setApartmentInfo(data.apartment.apartmentInfo);
    setFloor(data.apartment.floor);
    setBuildingId(data.apartment.buildingId);
    setOwner(data.apartment.owner);
    setTenant(data.apartment.tenant ?? "");
    setIsActive(data.apartment.isActive);
  }, [data]);

  const values = {
    apartmentInfo: apartmentInfo.trim(),
    floor: floor.trim(),
    buildingId,
    owner: owner.trim(),
  };

  const isValid = apartmentFormSchema.safeParse(values).success;

  const submit = async () => {
    const parsed = apartmentFormSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setSubmitError(null);
    const input = {
      ...parsed.data,
      tenant: tenant.trim() === "" ? null : tenant.trim(),
      isActive,
    };
    try {
      if (apartmentId) {
        await apartmentService.updateApartment(apartmentId, input);
        navigate(`/apartments/${apartmentId}`);
      } else {
        const created = await apartmentService.createApartment(input);
        navigate(`/apartments/${created.id}`);
      }
    } catch (cause) {
      setSubmitError(toErrorMessage(cause));
      setIsSubmitting(false);
    }
  };

  return {
    buildings: data?.buildings ?? [],
    isEditing: apartmentId !== null,
    isLoading,
    error,
    reload,
    apartmentInfo,
    setApartmentInfo,
    floor,
    setFloor,
    buildingId,
    setBuildingId,
    owner,
    setOwner,
    tenant,
    setTenant,
    isActive,
    setIsActive,
    isValid,
    isSubmitting,
    submitError,
    fieldErrors,
    submit,
  };
}
