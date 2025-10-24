import { ref } from "vue";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { getStorage } = useStorage();
const { IMPORTED_INVOICES, TRANSFORMED_INVOICES, SUBMITTED_INVOICES } =
  constants;

// --- GLOBAL SINGLETON STATE ---
const importedInvoices = ref<string | object | any[] | null>(
  getStorage({ storage_name: IMPORTED_INVOICES, storage_type: "array" }) || []
);

const transformedInvoices = ref<string | object | any[] | null>(
  getStorage({ storage_name: TRANSFORMED_INVOICES, storage_type: "array" }) ||
    []
);

const submittedInvoices = ref<string | object | any[] | null>(
  getStorage({ storage_name: SUBMITTED_INVOICES, storage_type: "array" }) || []
);

export function useDashboardState() {
  return {
    importedInvoices,
    transformedInvoices,
    submittedInvoices,
  };
}
