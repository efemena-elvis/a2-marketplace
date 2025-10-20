<template>
  <div class="contextual-action-bar">
    <span class="selection-count">{{ selectionCount }} invoices selected</span>

    <div class="action-row">
      <!-- Primary Action Button -->
      <button
        v-if="showPrimaryAction"
        class="btn btn-primary btn-sm"
        @click="emit('primary-action-clicked')"
        :disabled="isPrimaryLoading"
      >
        <div
          v-if="isPrimaryLoading"
          class="icon icon-spinner-ios animate-spin"
        ></div>
        <span v-else>{{ primaryActionText }}</span>
      </button>

      <!-- Secondary Action Button -->
      <button
        v-if="showSecondaryAction"
        class="btn btn-primary btn-sm"
        @click="emit('secondary-action-clicked')"
        :disabled="isSecondaryLoading"
      >
        <div
          v-if="isSecondaryLoading"
          class="icon icon-spinner-ios animate-spin"
        ></div>
        <span v-else>{{ secondaryActionText }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from "vue";

// ✅ Define Props with Defaults and Strong Typing
const props = withDefaults(
  defineProps<{
    selectionCount?: number;
    showPrimaryAction?: boolean;
    showSecondaryAction?: boolean;
    isPrimaryLoading?: boolean;
    isSecondaryLoading?: boolean;
    primaryActionText?: string;
    secondaryActionText?: string;
  }>(),
  {
    selectionCount: 0,
    showPrimaryAction: true,
    showSecondaryAction: false,
    isPrimaryLoading: false,
    isSecondaryLoading: false,
    primaryActionText: "Primary Action",
    secondaryActionText: "Secondary Action",
  }
);

// ✅ Define Emits
const emit = defineEmits<{
  (e: "primary-action-clicked"): void;
  (e: "secondary-action-clicked"): void;
}>();
</script>

<style lang="scss" scoped>
.contextual-action-bar {
  @apply bg-primary-50 border border-primary-200 rounded-lg py-3 px-4 mb-6 flex justify-between items-center animate-slide-down;

  .selection-count {
    @apply text-sm font-medium text-primary-900;
  }

  .action-row {
    @apply flex justify-end items-center gap-2;
  }

  .btn:disabled {
    @apply opacity-60 cursor-not-allowed;
  }
}
</style>
