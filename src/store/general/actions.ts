import $api from "@/shared/composables/useServiceAPI";
import { generalRoutes } from "./general-routes";
import { useAuthMutations } from "@/modules/auth/store/mutations";

export function useGeneralActions() {
  const { mutateBusinessMode } = useAuthMutations();

  const uploadFile = async (payload: any) => {
    const response: any = await $api.push(generalRoutes.fileUpload, {
      payload,
      is_attach: true,
    });
    return response;
  };

  const switchAppMode = async (payload: any) => {
    const response: any = await $api.push(generalRoutes.switchMode, {
      payload,
    });

    mutateBusinessMode(payload.mode);
    return response;
  };

  const contactSupport = async (payload: any) => {
    return await $api.push(generalRoutes.contactSupport, {
      payload,
      requiresPublicKey: true,
    });
  };

  const getBusinessCountries = async () => {
    return await $api.fetch(generalRoutes.countries);
  };

  return {
    uploadFile,
    switchAppMode,
    contactSupport,
    getBusinessCountries,
  };
}
