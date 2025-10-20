import useServiceAPI from "@/shared/composables/useServiceAPI";
import { settingsRoutes } from "./settings-routes";
import constants from "@/utilities/constants";

export function useSettingsActions() {
  const { API_BASE_URL, APP_AUTH_TOKEN } = constants;

  const $api = new useServiceAPI({
    API_BASE_URL: API_BASE_URL,
    TOKEN_KEY: APP_AUTH_TOKEN,
  });

  const getApiKeys = async () => {
    return await $api.fetch(settingsRoutes.getApiKeys, {
      resolve: false,
    });
  };

  const createApiKey = async (payload: any) => {
    return await $api.push(settingsRoutes.createApiKey, payload, {
      resolve: false,
    });
  };

  return {
    getApiKeys,
    createApiKey,
  };
}
