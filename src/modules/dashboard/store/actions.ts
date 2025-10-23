import useServiceAPI from "@/shared/composables/useServiceAPI";
import { dashboardRoutes } from "./dashboard-routes";
import constants from "@/utilities/constants";

export function useDashboardActions() {
  const { API_BASE_URL, APP_AUTH_TOKEN } = constants;

  const $api = new useServiceAPI({
    API_BASE_URL: API_BASE_URL,
    TOKEN_KEY: APP_AUTH_TOKEN,
  });

  const fetchBusinessInvoices = async () => {
    return await $api.push(
      dashboardRoutes.getInvoices,
      {},
      {
        headers: {
          zoho_authorization: localStorage.getItem("ZOHO_API_KEY") as string,
        },
        resolve: false,
      }
    );
  };

  return {
    fetchBusinessInvoices,
  };
}
