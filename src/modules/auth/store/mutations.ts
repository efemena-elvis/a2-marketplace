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
    authToken.value = payload.auth_token;
    axios.defaults.headers.common["Authorization"] = payload.auth_token;

    setStorage({
      storage_name: APP_AUTH_TOKEN,
      storage_value: payload.auth_token,
    });

    setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });
  };

  // MUTATE AUTH USER
  const mutateAuthUser = (payload: any) => {
    const { user } = payload;

    authUser.value = {
      id: user.id,
      email: user.email,
      country: user.country,
      firstName: user.first_name,
      lastName: user.last_name,
      currentBusiness: user.current_business,
      isEmailVerified: payload.is_email_verified,
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
