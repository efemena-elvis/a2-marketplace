import $api from "@/shared/composables/useServiceAPI";
import { useAuthMutations } from "./mutations";
import { authRoutes } from "./auth-routes";
import { IAPIType } from "@/models/api-type";

export function useAuthActions() {
  const { mutateUserData } = useAuthMutations();

  const loginUser = async (payload: any): Promise<IAPIType> => {
    const response: any = await $api.push(authRoutes.login, { payload });

    response?.code === 200 && mutateUserData(response?.data);
    return response;
  };

  const signupUser = async (payload: any) => {
    return await $api.push(authRoutes.signup, { payload });
  };

  const requestUserPassword = async (payload: any) => {
    return await $api.push(authRoutes.passwordRequest, { payload });
  };

  const resetUserPassword = async (payload: any) => {
    return await $api.push(authRoutes.passwordReset, { payload });
  };

  const sendVerifyEmail = async (payload: any) => {
    return await $api.push(authRoutes.sendVerifyEmail, {
      payload,
    });
  };

  const verifyEmail = async (payload: any) => {
    return await $api.push(authRoutes.verifyEmail, { payload });
  };

  const logoutUser = () => {
    localStorage.clear();
    location.href = "/";
  };

  return {
    loginUser,
    signupUser,
    requestUserPassword,
    resetUserPassword,
    sendVerifyEmail,
    verifyEmail,
    logoutUser,
  };
}
