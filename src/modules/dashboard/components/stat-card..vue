<template>
  <div class="stat-card">
    <div class="stat-header">
      <div class="icon-wrapper" :class="bgColor">
        <div class="icon" :class="icon"></div>
      </div>

      <span class="stat-title">{{ title }}</span>
    </div>

    <div class="stat-value">{{ value }}</div>
    <p class="stat-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface IStat {
  title: string;
  value: string;
  description: string;
  bgColor: string;
  icon: string;
}

withDefaults(defineProps<IStat>(), {
  title: "",
  value: "",
  description: "",
  bgColor: "",
  icon: "",
});
</script>

<style lang="scss" scoped>
.stat-card {
  @apply bg-neutral-10 p-5 rounded-xl border border-grey-200/80 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary-100;

  .stat-header {
    @apply flex items-center gap-x-4 mb-4;

    .icon-wrapper {
      @apply size-10 min-w-10 min-h-10 rounded-full flex items-center justify-center;

      .icon {
        @apply text-xl;
      }
    }

    .stat-title {
      @apply font-medium text-grey-700;
    }
  }

  .stat-value {
    @apply text-4xl font-semibold text-grey-900 mb-2;
  }

  .stat-description {
    @apply text-sm text-grey-500;
  }
}
</style>
