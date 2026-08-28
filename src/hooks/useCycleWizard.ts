import { useCallback, useState } from "react";
import type { PaymentAllocationInput } from "../types/payment";
import type { PaymentCycle } from "../types/cycle";
import { apartmentService, balanceService, cycleService, toErrorMessage } from "../services";
import { periodDueDates } from "../utils/paymentSchedule";
import { totalPercentage } from "../utils/percentage";
import { useAsyncData } from "./useAsyncData";

export const TOTAL_WIZARD_STEPS = 5;

export function useCycleWizard() {
  const loader = useCallback(async () => {
    const [apartments, balances] = await Promise.all([
      apartmentService.getApartments(),
      balanceService.getBalances(),
    ]);
    return { apartments, balances };
  }, []);

  const { data, isLoading, error, reload } = useAsyncData(loader);

  const currentYear = new Date().getFullYear();
  const [step, setStep] = useState(1);
  const [label, setLabel] = useState(`${currentYear} monthly dues`);
  const [paymentCycle, setPaymentCycle] = useState<PaymentCycle>("Monthly");
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [amount, setAmount] = useState(50);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [allocations, setAllocations] = useState<PaymentAllocationInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const apartments = data?.apartments ?? [];
  const selectedIds = apartments
    .map((apartment) => apartment.id)
    .filter((id) => !excludedIds.has(id));

  const toggleApartment = (id: string) => {
    setExcludedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setExcludedIds(new Set());

  const dueDatesCount = periodDueDates(paymentCycle, startDate, endDate).length;

  const canContinue = (() => {
    switch (step) {
      case 1:
        return label.trim() !== "" && dueDatesCount > 0;
      case 2:
        return amount > 0;
      case 3:
        return selectedIds.length > 0;
      case 4:
        return totalPercentage(allocations.map((allocation) => allocation.percentage)) === 100;
      default:
        return true;
    }
  })();

  const submit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await cycleService.createCycle({
        label: label.trim(),
        paymentCycle,
        startDate,
        endDate,
        amount,
        balanceAllocations: allocations,
        apartmentIds: selectedIds,
      });
      setStep(6);
    } catch (cause) {
      setSubmitError(toErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (!canContinue) return;
    if (step === TOTAL_WIZARD_STEPS) void submit();
    else setStep((current) => current + 1);
  };

  const goBack = () => setStep((current) => Math.max(1, current - 1));

  return {
    apartments,
    balances: data?.balances ?? [],
    isLoading,
    error,
    reload,
    step,
    label,
    setLabel,
    paymentCycle,
    setPaymentCycle,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    amount,
    setAmount,
    selectedIds,
    toggleApartment,
    selectAll,
    allocations,
    setAllocations,
    dueDatesCount,
    totalPayments: dueDatesCount * selectedIds.length,
    canContinue,
    isSubmitting,
    submitError,
    goNext,
    goBack,
  };
}
