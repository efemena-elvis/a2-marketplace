<template>
  <div class="page-layout">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="page-header--left">
        <div class="page-title">{{ title }}</div>
        <div class="page-description">
          {{ description }}
        </div>
      </div>

      <div class="page-header--right" v-if="showActionBtn">
        <button
          class="btn btn-primary btn-sm"
          @click="handleActionClick"
          :disabled="isActionLoading"
        >
          <div
            v-if="isActionLoading"
            class="icon icon-spinner-ios animate-spin"
          ></div>

          <span v-else>{{ actionText }}</span>
        </button>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
/* ---------------------------------------------------------
   🧩 INTERFACES
--------------------------------------------------------- */
interface PageLayoutProps {
  title: string;
  description?: string;
  showActionBtn?: boolean;
  actionText?: string;
  isActionLoading?: boolean;
}

/* ---------------------------------------------------------
   📦 EMITS
--------------------------------------------------------- */
const emit = defineEmits<{
  (e: "onActionClicked"): void;
}>();

/* ---------------------------------------------------------
   🧩 PROPS
--------------------------------------------------------- */
const props = withDefaults(defineProps<PageLayoutProps>(), {
  title: "",
  description: "",
  showActionBtn: false,
  actionText: "",
  isActionLoading: false,
});

/* ---------------------------------------------------------
   📦 METHODS
--------------------------------------------------------- */
const handleActionClick = () => {
  emit("onActionClicked");
};
</script>

<style lang="scss" scoped>
.page-layout {
  .page-header {
    @apply flex justify-between items-center mb-8;

    &--left {
      @apply flex flex-col gap-1;

      .page-title {
        @apply text-2xl font-semibold text-grey-900;
      }

      .page-description {
        @apply text-grey-500 text-[15px];
      }
    }
  }
}
</style>
