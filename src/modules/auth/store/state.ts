import { ref } from "vue";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

interface IAuthBusiness {
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

const { getStorage } = useStorage();
const {
  REDSTONE_AUTH_TOKEN,
  REDSTONE_AUTH_USER,
  REDSTONE_AUTH_BUSINESS,
  REDSTONE_AUTH_BUSINESS_TOKEN,
} = constants;

export function useAuthState() {
  const authToken = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_TOKEN,
    }) || ""
  );

  const authUser = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_USER,
      storage_type: "object",
    }) || ""
  );

  const authBusiness = ref<IAuthBusiness>(
    getStorage({
      storage_name: REDSTONE_AUTH_BUSINESS,
      storage_type: "object",
    }) as IAuthBusiness
  );

  const authBusinessToken = ref<string | object>(
    getStorage({
      storage_name: REDSTONE_AUTH_BUSINESS_TOKEN,
      storage_type: "object",
    }) || ""
  );

  return {
    authToken,
    authUser,
    authBusiness,
    authBusinessToken,
  };
}
