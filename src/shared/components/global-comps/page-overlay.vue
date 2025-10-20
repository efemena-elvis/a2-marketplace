<template>
  <div class="page-loader-overlay">
    <!-- Main content centered on the page -->
    <div class="loader-content">
      <!-- Spinner Icon -->
      <div class="icon icon-spinner-ios animate-spin spinner-icon"></div>

      <!-- Loading Text -->
      <p v-if="loadingText" class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// --- PROPS ---
withDefaults(
  defineProps<{
    loadingText?: string;
  }>(),
  {
    loadingText: "Processing...",
  }
);
</script>

<style lang="scss" scoped>
.page-loader-overlay {
  @apply fixed inset-0 w-full h-full flex items-center justify-center;
  background-color: rgba(255, 255, 255, 0.8); // White with 80% opacity
  z-index: 9990; // High z-index to be on top of page content
  backdrop-filter: blur(4px); // Adds a nice blur effect to the content behind
}

.loader-content {
  @apply flex flex-col items-center justify-center text-center gap-y-4;

  .spinner-icon {
    @apply text-5xl text-primary-800;
  }

  .loading-text {
    @apply text-base font-medium text-grey-800;
  }
}
</style>
