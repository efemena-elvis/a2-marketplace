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
defineProps<{
  title: string;
  value: number | string;
  description: string;
  icon: string;
  bgColor: string;
}>();
</script>

<style lang="scss" scoped>
.stat-card {
  @apply bg-neutral-10 p-5 rounded-xl border border-grey-200/60 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary-100;
}
.stat-header {
  @apply flex items-center gap-x-4 mb-4;
}
.icon-wrapper {
  @apply size-10 rounded-full flex items-center justify-center;
}
.icon-wrapper .icon {
  @apply text-xl;
}
.stat-title {
  @apply font-medium text-grey-700;
}
.stat-value {
  @apply text-4xl font-semibold text-grey-900 mb-2;
}
.stat-description {
  @apply text-sm text-grey-500;
}
// Icon colors
.bg-blue-100 .icon {
  @apply text-blue-600;
}
.bg-yellow-100 .icon {
  @apply text-yellow-600;
}
.bg-teal-100 .icon {
  @apply text-teal-600;
}
.bg-green-100 .icon {
  @apply text-green-600;
}
</style>
