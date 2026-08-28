import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apartmentService, buildingService, toErrorMessage } from "../services";
import { useAsyncData } from "./useAsyncData";

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

  useEffect(() => {
    if (!data?.apartment) return;
    setApartmentInfo(data.apartment.apartmentInfo);
    setFloor(data.apartment.floor);
    setBuildingId(data.apartment.buildingId);
    setOwner(data.apartment.owner);
    setTenant(data.apartment.tenant ?? "");
    setIsActive(data.apartment.isActive);
  }, [data]);

  const isValid =
    apartmentInfo.trim() !== "" &&
    floor.trim() !== "" &&
    buildingId !== "" &&
    owner.trim() !== "";

  const submit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setSubmitError(null);
    const input = {
      apartmentInfo: apartmentInfo.trim(),
      floor: floor.trim(),
      buildingId,
      owner: owner.trim(),
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
    submit,
  };
}
