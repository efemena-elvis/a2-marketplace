<template>
  <div>
    <!-- Render the PageLoader if the global loading state is true -->
    <PageLoader
      v-if="isAppLoading"
      title="Connecting to invoice provider"
      subtitle="Just a moment..."
    />

    <!-- Render the main application content when loading is false -->
    <router-view v-else />

    <!-- Your ToastCard component would likely live here as well -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import PageLoader from "@/shared/components/global-comps/page-loader.vue";
import { useAuthStore } from "@/modules/auth/store";
import useEvents from "@/shared/composables/useEvents";
import { useProfile } from "@/shared/composables/useProfile";

const route = useRoute();
const { providerConnect } = useAuthStore();
const { processAPIRequest } = useEvents();

const { getUser } = useProfile();
const { companyId } = getUser();

// This would typically come from a global store (like Pinia/Vuex)
const isAppLoading = ref(true);

const handlerProviderAuth = async () => {
  const response = await processAPIRequest({
    action: providerConnect,
    payload: {
      code: route.query.code,
      state: route.query?.state ?? "testing",
      company_id: companyId,
    },
    showAlert: false,
  });

  if (response.status === 200) {
    setTimeout(() => (location.href = "/dashboard"), 1000);
  }
};

onMounted(() => {
  setTimeout(() => handlerProviderAuth(), 2000);
});
</script>

<style lang="scss"></style>
