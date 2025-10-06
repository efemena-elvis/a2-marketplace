import { computed } from "vue";
import { useAuthState } from "./state";

export function useAuthGetters() {
  const { authToken, authUser } = useAuthState();

  const getAuthToken = computed(() => authToken.value);
  const getAuthUser = computed(() => authUser.value);

  return {
    getAuthToken,
    getAuthUser,
  };
}
