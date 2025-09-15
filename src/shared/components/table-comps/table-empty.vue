<template>
  <div class="table-empty">
    <!-- EMPTY IMAGE -->
    <div class="img-wrapper">
      <img :src="renderImg(`${customImg}`)" alt="empty-table" />
    </div>

    <!-- TITLE TEXT -->
    <div class="title-text">{{ title }}</div>

    <!-- DESCRIPTION TEXT -->
    <div class="description-text">
      {{ description }}
    </div>

    <!-- ACTION BUTTON -->
    <button
      class="btn btn-primary btn-sm mt-6"
      v-if="actionText.length"
      @click="$emit('onActionClicked')"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useString } from "@/shared/composables/useString";

defineEmits(["onActionClicked"]);

defineProps({
  title: {
    type: String,
    default: "Table is empty",
  },
  description: {
    type: String,
    default: "No table data is available yet",
  },
  customImg: {
    type: String,
    default: "empty-box.png",
  },
  actionText: {
    type: String,
    default: "",
  },
});

const { renderImg } = useString();
</script>

<style lang="scss" scoped>
.table-empty {
  @apply flex flex-col justify-center items-center gap-y-3 mt-5 py-8 sm:py-6 lg:-mt-1 sm:mt-3 mb-12 mdLg:mb-16;

  .img-wrapper {
    img {
      @apply w-[110px] lg:w-[96px] h-auto;
    }
  }

  .title-text {
    @apply text-center text-[22px] xl:text-lg font-medium text-teal-900/80;
  }

  .description-text {
    @apply text-[14.75px] mdLg:text-sm leading-6 mdLg:leading-[24.25px] text-grey-600/95 text-center mx-auto w-[48%] xl:w-[54%] lg:w-4/5 sm:w-[98%];
  }
}
</style>
