import { computed } from "vue";
import { useAuthState } from "./state";

export function useAuthGetters() {
  const { authToken, authUser, zohoServiceProvider } = useAuthState();

  const getAuthToken = computed(() => authToken.value);
  const getAuthUser = computed(() => authUser.value);
  const getZohoServiceProvider = computed(() => zohoServiceProvider.value);

  return {
    getAuthToken,
    getAuthUser,
    getZohoServiceProvider,
  };
}
