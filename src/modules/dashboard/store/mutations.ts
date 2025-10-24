import { toRaw } from "vue";
import { useDashboardState } from "./state";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { setStorage } = useStorage();
const { IMPORTED_INVOICES, TRANSFORMED_INVOICES, SUBMITTED_INVOICES } =
  constants;

export function useDashboardMutations() {
  const { importedInvoices, transformedInvoices, submittedInvoices } =
    useDashboardState();

  // MUTATE IMPORTED INVOICES
  const mutateImportedInvoices = async (payload: any[]) => {
    try {
      if (!Array.isArray(payload) || payload.length === 0) return;

      // Ensure all are arrays to safely iterate
      const imported = Array.isArray(importedInvoices.value)
        ? importedInvoices.value
        : [];
      const transformed = Array.isArray(transformedInvoices.value)
        ? transformedInvoices.value
        : [];
      const submitted = Array.isArray(submittedInvoices.value)
        ? submittedInvoices.value
        : [];

      // Combine all existing IDs for duplicate check
      const existingIds = new Set([
        ...imported.map((inv) => inv.invoice_id),
        ...transformed.map((inv) => inv.invoice_id),
        ...submitted.map((inv) => inv.invoice_id),
      ]);

      // Filter new invoices
      const newInvoices = payload.filter(
        (inv) => !existingIds.has(inv.invoice_id)
      );

      if (newInvoices.length === 0) return;

      // Merge new invoices with imported list
      const updatedImportedInvoices = [...imported, ...newInvoices];

      // Update local state (reactive)
      importedInvoices.value = updatedImportedInvoices;

      // Persist to storage
      setStorage({
        storage_name: IMPORTED_INVOICES,
        storage_value: updatedImportedInvoices,
        storage_type: "array",
      });
    } catch (error) {
      console.error("Error mutating imported invoices:", error);
    }
  };

  const mutateTransformedInvoices = async (payload: any, invoiceId: string) => {
    try {
      if (!invoiceId) return;

      // Ensure all are arrays to safely iterate
      const imported = Array.isArray(importedInvoices.value)
        ? importedInvoices.value
        : [];
      const transformed = Array.isArray(transformedInvoices.value)
        ? transformedInvoices.value
        : [];

      const getInvoice = imported.find((inv) => inv.invoice_id === invoiceId);

      // Step 1: Remove invoice from imported list
      const updatedImportedInvoices = imported.filter(
        (inv) => inv.invoice_id !== invoiceId
      );

      // Step 2: Add payload into transformed list
      const updatedTransformedInvoices = [
        ...transformed,
        { ...getInvoice, transformed_invoice: payload },
      ];

      // Step 3: Update reactive states
      importedInvoices.value = updatedImportedInvoices;
      transformedInvoices.value = updatedTransformedInvoices;

      // Step 4: Persist both updated lists to storage
      setStorage({
        storage_name: IMPORTED_INVOICES,
        storage_value: updatedImportedInvoices,
        storage_type: "array",
      });

      setStorage({
        storage_name: TRANSFORMED_INVOICES,
        storage_value: updatedTransformedInvoices,
        storage_type: "array",
      });
    } catch (error) {
      console.error("Error mutating transformed invoices:", error);
    }
  };

  const mutateSubmittedInvoices = async (invoiceId: string) => {
    try {
      if (!invoiceId) return;

      // Ensure all are arrays to safely iterate
      const transformed = Array.isArray(transformedInvoices.value)
        ? transformedInvoices.value
        : [];
      const submitted = Array.isArray(submittedInvoices.value)
        ? submittedInvoices.value
        : [];

      const getInvoice = transformed.find(
        (inv) => inv.invoice_id === invoiceId
      );

      // Step 1: Remove from transformed list
      const updatedTransformedInvoices = transformed.filter(
        (inv) => inv.invoice_id !== invoiceId
      );

      // Step 2: Add payload to submitted list
      const updatedSubmittedInvoices = [...submitted, getInvoice];

      // Step 3: Update reactive states
      transformedInvoices.value = updatedTransformedInvoices;
      submittedInvoices.value = updatedSubmittedInvoices;

      // Step 4: Persist both to storage
      setStorage({
        storage_name: TRANSFORMED_INVOICES,
        storage_value: updatedTransformedInvoices,
        storage_type: "array",
      });

      setStorage({
        storage_name: SUBMITTED_INVOICES,
        storage_value: updatedSubmittedInvoices,
        storage_type: "array",
      });
    } catch (error) {
      console.error("Error mutating submitted invoices:", error);
    }
  };

  return {
    mutateImportedInvoices,
    mutateTransformedInvoices,
    mutateSubmittedInvoices,
  };
}
