import useServiceAPI from "@/shared/composables/useServiceAPI";
import { dashboardRoutes } from "./dashboard-routes";
import { useDashboardMutations } from "./mutations";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";
import { imported_invoices } from "@/utilities/invoices";

export function useDashboardActions() {
  const { getStorage } = useStorage();
  const { API_BASE_URL, APP_AUTH_TOKEN, ZOHO_SERVICE_PROVIDER } = constants;
  const {
    mutateImportedInvoices,
    mutateTransformedInvoices,
    mutateSubmittedInvoices,
  } = useDashboardMutations();

  const $api = new useServiceAPI({
    API_BASE_URL: API_BASE_URL,
    TOKEN_KEY: APP_AUTH_TOKEN,
  });

  const fetchBusinessInvoices = async () => {
    const getZohoServiceProvider: any =
      getStorage({
        storage_name: ZOHO_SERVICE_PROVIDER,
        storage_type: "object",
      }) || {};

    const getZohoToken = getZohoServiceProvider?.access_token || null;

    const response = await $api.fetch(dashboardRoutes.getInvoices, {
      headers: {
        zoho_authorization: getZohoToken,
      },
      resolve: false,
    });

    // MUTATE RESPONSE

    if (response.status === 200) {
      mutateImportedInvoices(response.data.data.imported);
      return response.data;
    }

    // TEMP
    // mutateImportedInvoices(imported_invoices);

    return {
      data: {
        imported: imported_invoices,
      },
    };
  };

  const transformBusinessInvoice = async ({
    invoiceId,
  }: {
    invoiceId: string;
  }) => {
    const getZohoServiceProvider: any =
      getStorage({
        storage_name: ZOHO_SERVICE_PROVIDER,
        storage_type: "object",
      }) || {};

    const getZohoToken = getZohoServiceProvider?.access_token || null;

    const response = await $api.push(
      `${dashboardRoutes.transformInvoice}/${invoiceId}`,
      {},
      {
        headers: {
          zoho_authorization: getZohoToken,
        },
        resolve: false,
      }
    );

    if (response.status === 200) {
      mutateTransformedInvoices(response.data, invoiceId);
      return response.data;
    }

    // TEMP
    // mutateTransformedInvoices(response.data || {}, invoiceId);

    return response;
  };

  const submitBusinessInvoice = async (payload: any) => {
    const { invoice } = payload;

    const response = await $api.push(
      dashboardRoutes.submitInvoice,
      { payload: invoice.transformed_invoice },
      {
        resolve: false,
      }
    );

    if (response.status === 200) {
      mutateSubmittedInvoices(invoice.invoice_id);
      return response.data;
    }

    // TEMP
    // mutateSubmittedInvoices(invoice.invoice_id);

    return response;
  };

  return {
    fetchBusinessInvoices,
    transformBusinessInvoice,
    submitBusinessInvoice,
  };
}
