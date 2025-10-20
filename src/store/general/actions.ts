import $api from "@/shared/composables/useServiceAPI";
import { generalRoutes } from "./general-routes";
import { useAuthMutations } from "@/modules/auth/store/mutations";

export function useGeneralActions() {
  // const uploadFile = async (payload: any) => {
  //   const response: any = await $api.push(generalRoutes.fileUpload, {
  //     payload,
  //     is_attach: true,
  //   });
  //   return response;
  // };

  // const getBusinessCountries = async () => {
  //   return await $api.fetch(generalRoutes.countries);
  // };

  return {
    // uploadFile,
    // getBusinessCountries,
  };
}
