<template>
  <div class="page-loader-overlay">
    <!-- Main content centered on the page -->
    <div class="loader-content">
      <!-- Brand Logo -->
      <img
        :src="renderImg('a2-logo.png')"
        alt="A2 Core Logo"
        class="brand-logo"
      />

      <!-- Connection Text -->
      <h1 class="title-text">{{ title }}</h1>
      <p class="subtitle-text">{{ subtitle }}</p>
    </div>

    <!-- Spinner animation at the bottom -->
    <div class="spinner-container">
      <div class="icon icon-spinner-ios animate-spin spinner-icon"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@/shared/composables/useString";

// --- PROPS ---
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: "Connecting to your workspace",
    subtitle: "Please wait a moment while we get things ready for you.",
  }
);

// --- COMPOSABLES ---
const { renderImg } = useString();
</script>

<style lang="scss" scoped>
.page-loader-overlay {
  @apply fixed inset-0 w-screen h-screen bg-neutral-10 flex items-center justify-center;
  z-index: 9999; // Ensure it's on top of everything
}

.loader-content {
  @apply flex flex-col items-center justify-center text-center px-4;

  .brand-logo {
    @apply w-48 h-auto mb-8;
  }

  .title-text {
    @apply text-lg font-semibold text-grey-900 mb-2;
  }

  .subtitle-text {
    @apply text-sm text-grey-600 max-w-xs;
  }
}

.spinner-container {
  @apply absolute bottom-0 left-0 right-0 flex justify-center p-12;

  .spinner-icon {
    @apply text-5xl text-primary-800;
  }
}
</style>
