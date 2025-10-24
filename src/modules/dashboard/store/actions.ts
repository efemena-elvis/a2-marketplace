import useServiceAPI from "@/shared/composables/useServiceAPI";
import { dashboardRoutes } from "./dashboard-routes";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

export function useDashboardActions() {
  const { getStorage } = useStorage();
  const { API_BASE_URL, APP_AUTH_TOKEN, ZOHO_SERVICE_PROVIDER } = constants;

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

    return await $api.fetch(dashboardRoutes.getInvoices, {
      headers: {
        zoho_authorization: getZohoToken,
      },
      resolve: false,
    });
  };

  return {
    fetchBusinessInvoices,
  };
}
