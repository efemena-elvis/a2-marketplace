import axios from "axios";
import { useAuthState } from "./state";
import { useStorage } from "@/shared/composables/useStorage";
import { useString } from "@/shared/composables/useString";
import constants from "@/utilities/constants";

const { setStorage } = useStorage();
const { encodeString, getRandomString } = useString();
const { APP_AUTH_TOKEN, APP_AUTH_USER } = constants;

export function useAuthMutations() {
  const { authToken, authUser } = useAuthState();

  const mutateUserData = (responsePayload: any) => {
    mutateAuthToken(responsePayload);
    mutateAuthUser(responsePayload);
  };

  // MUTATE AUTH TOKEN
  const mutateAuthToken = (payload: any) => {
    authToken.value = payload.token;
    axios.defaults.headers.common["Authorization"] = payload.token;

    setStorage({
      storage_name: APP_AUTH_TOKEN,
      storage_value: payload.token,
    });

    setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });
  };

  // MUTATE AUTH USER
  const mutateAuthUser = (payload: any) => {
    const { user, company } = payload;

    authUser.value = {
      id: user.id,
      email: user.email,
      fullName: user.name,
      companyId: company.id,
      companyName: company.name,
      companyRCNumber: company.rc_number,
    };

    setStorage({
      storage_name: APP_AUTH_USER,
      storage_value: authUser.value,
      storage_type: "object",
    });
  };

  return {
    mutateUserData,
  };
}
