<template>
  <div class="settings-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-description">
        Manage your profile, account, and connections.
      </p>
    </div>

    <div class="settings-container">
      <!-- SETTINGS NAVIGATION (TABS) -->
      <div class="settings-nav">
        <router-link
          v-for="tab in settingsTabs"
          :key="tab.name"
          :to="tab.path"
          class="nav-tab"
          active-class="nav-tab--active"
        >
          {{ tab.name }}
        </router-link>
      </div>

      <!-- MAIN CONTENT FOR THE SELECTED TAB -->
      <div class="settings-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const settingsTabs = ref([
  { name: "Profile", path: "/settings/profile" },
  { name: "Contact Information", path: "/settings/contact-information" },
  { name: "Security", path: "/settings/security" },
  { name: "Service Providers", path: "/settings/providers" },
]);
</script>

<style lang="scss" scoped>
.settings-page {
  @apply pt-4;
}

.page-header {
  @apply mb-8;

  .page-title {
    @apply text-2xl font-semibold text-grey-900;
  }

  .page-description {
    @apply text-grey-600 mt-1;
  }
}

.settings-container {
  @apply grid grid-cols-1 lg:grid-cols-4 gap-8 w-max;
}

.settings-nav {
  @apply lg:col-span-1 flex lg:flex-col items-start gap-y-1 bg-neutral-10 p-2 rounded-lg border border-grey-200/80;

  .nav-tab {
    @apply w-max text-center text-grey-700 px-5 py-3 rounded-md font-medium text-[15px] transition-colors duration-200 hover:bg-primary-50 hover:text-primary-900;

    &--active {
      @apply bg-primary-100 text-primary-900;
    }
  }
}

.settings-content {
  @apply lg:col-span-3;
}
</style>
