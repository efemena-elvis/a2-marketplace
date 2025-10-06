import { useAuthStore } from "@/modules/auth/store";
import { useString } from "@/shared/composables/useString";

const { decodeString } = useString();
const { getAuthToken, getAuthUser } = useAuthStore();

interface IUserProfile {
  id: string;
  email: string;
  country: {
    country_code: string;
    currency_code: string;
    name: string;
    id: string;
  };
  firstName: string;
  lastName: string;
  currentBusiness: string;
  isEmailVerified: boolean;
}

interface IAPIKeys {
  playground: any;
  alcatraz?: any;
}

export function useProfile() {
  const getToken = () => {
    return getAuthToken;
  };

  const isUserAuthenticated = () => {
    if (typeof getAuthToken === "string") {
      return getAuthToken.length ? true : false;
    }

    return false;
  };

  const getUser = () => {
    return getAuthUser as IUserProfile;
  };

  return {
    getToken,
    isUserAuthenticated,
    getUser,
  };
}
