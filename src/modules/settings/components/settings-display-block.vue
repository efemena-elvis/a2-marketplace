<template>
  <div class="profile-settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ title }}</h2>
      <p class="card-description">
        {{ description }}
      </p>
    </div>

    <form @submit.prevent="handleFormSubmission">
      <div class="card-body">
        <slot />
      </div>

      <div class="card-footer" v-if="showFooter">
        <button
          class="btn btn-primary btn-md"
          type="submit"
          :disabled="isActionLoading"
        >
          <div
            v-if="isActionLoading"
            class="icon icon-spinner-ios animate-spin"
          ></div>
          <span v-else>{{ actionText }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// ✅ Define Props with Defaults and Strong Typing
withDefaults(
  defineProps<{
    title: string;
    description: string;
    actionText?: string;
    isActionLoading?: boolean;
    showFooter?: boolean;
  }>(),
  {
    title: "",
    description: "",
    actionText: "",
    isActionLoading: false,
    showFooter: true,
  }
);

// ✅ Define Emits
const emit = defineEmits<{
  (e: "form-submitted"): void;
}>();

// ✅ Define Methods
const handleFormSubmission = () => {
  emit("form-submitted");
};
</script>

<style lang="scss" scoped>
.profile-settings-card {
  @apply bg-neutral-10 rounded-xl border border-grey-200/80 mb-20;

  .card-header {
    @apply p-6 border-b border-b-grey-200/80;

    .card-title {
      @apply text-lg font-semibold text-grey-900;
    }
    .card-description {
      @apply text-sm text-grey-600 mt-1;
    }
  }

  .card-body {
    @apply px-6 pt-10 pb-6;
  }

  .card-footer {
    @apply p-6 bg-grey-50/50 border-t border-t-grey-200/80 flex justify-end;
  }
}
</style>
