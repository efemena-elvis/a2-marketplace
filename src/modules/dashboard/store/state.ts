import { ref } from "vue";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { getStorage } = useStorage();
const { IMPORTED_INVOICES, TRANSFORMED_INVOICES, SUBMITTED_INVOICES } =
  constants;

export function useDashboardState() {
  const importedInvoices = ref<string | object | any[] | null>(
    getStorage({
      storage_name: IMPORTED_INVOICES,
      storage_type: "object",
    }) || []
  );

  const transformedInvoices = ref<string | object | any[] | null>(
    getStorage({
      storage_name: TRANSFORMED_INVOICES,
      storage_type: "object",
    }) || []
  );

  const submittedInvoices = ref<string | object | any[] | null>(
    getStorage({
      storage_name: SUBMITTED_INVOICES,
      storage_type: "object",
    }) || []
  );

  return {
    importedInvoices,
    transformedInvoices,
    submittedInvoices,
  };
}
