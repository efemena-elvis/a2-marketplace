<template>
  <div class="w-full w-max-full m-auto">
    <!-- TITLE TEXT -->
    <div class="text-xl md:text-lg text-grey-900 text-center mb-12">
      {{ title_text }}
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title_text: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
