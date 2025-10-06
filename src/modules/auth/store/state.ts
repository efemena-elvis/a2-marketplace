import { ref } from "vue";
import { useStorage } from "@/shared/composables/useStorage";
import constants from "@/utilities/constants";

const { getStorage } = useStorage();
const { APP_AUTH_TOKEN, APP_AUTH_USER } = constants;

export function useAuthState() {
  const authToken = ref<string | object>(
    getStorage({
      storage_name: APP_AUTH_TOKEN,
    }) || ""
  );

  const authUser = ref<string | object>(
    getStorage({
      storage_name: APP_AUTH_USER,
      storage_type: "object",
    }) || ""
  );

  return {
    authToken,
    authUser,
  };
}
