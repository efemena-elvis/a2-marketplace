import useServiceAPI from "@/shared/composables/useServiceAPI";
import { authRoutes } from "./auth-routes";
import { useAuthMutations } from "./mutations";
import { IAPIType } from "@/models/api-type";
import constants from "@/utilities/constants";

export function useAuthActions() {
  const { API_BASE_URL, APP_AUTH_TOKEN } = constants;

  const $api = new useServiceAPI({
    API_BASE_URL: API_BASE_URL,
    TOKEN_KEY: APP_AUTH_TOKEN,
  });

  const { mutateUserData } = useAuthMutations();

  const loginUser = async (payload: any): Promise<IAPIType> => {
    const response: any = await $api.push(authRoutes.login, payload, {
      resolve: false,
    });

    if (response?.status === 200) {
      const { data } = response.data;

      const normalizedPayload = {
        ...data,
        user: {
          ...data.user,
          company_name: "BlackRock Limited",
        },
      };

      mutateUserData(normalizedPayload);
    }
    return response;
  };

  const signupUser = async (payload: any) => {
    return await $api.push(authRoutes.signup, payload, {
      resolve: false,
    });
  };

  const verifyAccount = async (payload: any) => {
    return await $api.push(authRoutes.verifyAccount, payload, {
      resolve: false,
    });
  };

  const providerConnect = async ({ code, company_id }: any) => {
    return await $api.fetch(authRoutes.providerConnect, {
      params: { code, company_id },
      headers: { "x-api-key": localStorage.getItem("API_KEY") as string },
      resolve: false,
    });
  };

  const logoutUser = async () => {
    const response = await $api.push(authRoutes.logout);

    if (response.status === 200) {
      localStorage.clear();
      location.href = "/login";
    }
  };

  return {
    loginUser,
    signupUser,
    verifyAccount,
    logoutUser,
    providerConnect,
  };
}
