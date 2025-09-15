import { useAuthStore } from "@/modules/auth/store";
import { useString } from "@/shared/composables/useString";

const { decodeString } = useString();
const { getAuthToken, getAuthUser, getAuthBusiness, getAuthBusinessToken } =
  useAuthStore();

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

interface IBusinessProfile {
  businessAddress: string;
  bankAccountNumber: string;
  bankName: string;
  disputeEmailAddress: string;
  generalEmailAddress: string;
  businessId: string;
  businessLogo: string;
  businessMode: string;
  businessName: string;
  businessSector: string;
  activated: string;
  supportEmailAddress: string;
  activateMyBusiness: boolean;
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

  const getBusiness = () => {
    const { bankAccountNumber, bankName, ...business } =
      getAuthBusiness as IBusinessProfile;

    return {
      bankAccountNumber: decodeString(bankAccountNumber),
      bankName: decodeString(bankName),
      ...business,
    };
  };

  const getBusinessActivatedStatus = () => {
    const { activated } = getAuthBusiness as IBusinessProfile;
    return decodeString(activated);
  };

  const getAPIKeys = (): {
    test: { public: string; secret: string };
    live: { public: string; secret: string };
  } => {
    const { playground, alcatraz } = getAuthBusinessToken as IAPIKeys;

    return {
      test: {
        public: decodeString(playground.nigeria),
        secret: decodeString(playground.unitedKingdom),
      },
      live: {
        public: alcatraz?.nigeria ? decodeString(alcatraz.nigeria) : "",
        secret: alcatraz?.unitedKingdom
          ? decodeString(alcatraz.unitedKingdom)
          : "",
      },
    };
  };

  return {
    getToken,
    isUserAuthenticated,
    getUser,
    getBusiness,
    getBusinessActivatedStatus,
    getAPIKeys,
  };
}
