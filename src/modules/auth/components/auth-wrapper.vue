<template>
  <div class="w-full w-max-full m-auto">
    <!-- TITLE TEXT -->
    <div class="mb-12">
      <div class="text-xl md:text-lg text-grey-900 text-center">
        {{ title_text }}
      </div>

      <!-- DESCRIPTION TEXT -->
      <div
        v-if="description_text"
        class="text-sm text-center text-grey-600 mt-3"
      >
        {{ description_text }}
      </div>
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

  description_text: {
    type: String,
  },
});
</script>

<style lang="scss" scoped></style>
