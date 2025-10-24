import { computed } from "vue";
import { useDashboardState } from "./state";

export function useDashboardGetters() {
  const { importedInvoices, transformedInvoices, submittedInvoices } =
    useDashboardState();

  const getImportedInvoices = computed(() => importedInvoices.value);
  const getTransformedInvoices = computed(() => transformedInvoices.value);
  const getSubmittedInvoices = computed(() => submittedInvoices.value);

  return {
    getImportedInvoices,
    getTransformedInvoices,
    getSubmittedInvoices,
  };
}
