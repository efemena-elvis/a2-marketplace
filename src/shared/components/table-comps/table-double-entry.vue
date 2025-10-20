<template>
  <div class="double-column-entry">
    <div class="content-display">
      <div class="primary-column-text" v-html="entry.primaryText"></div>
      <div class="secondary-column-text">{{ entry.secondaryText }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  entry: {
    type: Object,
    default: () => ({
      primaryText: "Primary entry",
      secondaryText: "Secondary entry...",
    }),
  },
});
</script>

<style lang="scss" scoped>
.double-column-entry {
  @apply flex justify-start items-center gap-x-3;

  .content-display {
    @apply flex flex-col justify-start items-start gap-y-[3px];

    .primary-column-text {
      @apply text-grey-800/90 font-semibold text-sm;
    }

    .secondary-column-text {
      @apply text-grey-600 text-[13px];
    }
  }
}
</style>
