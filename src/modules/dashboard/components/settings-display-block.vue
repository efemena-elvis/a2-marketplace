<template>
  <div class="settings-display-block">
    <!-- CONTENT TOP AREA -->
    <div class="content-top">
      <div class="content-top--title">{{ title }}</div>
      <div class="content-top--description">
        {{ description }}
      </div>
    </div>

    <template v-if="isProfileLoading">
      <SkeletonDisplay />
    </template>

    <template v-else>
      <div class="content-area mb-8">
        <slot></slot>
      </div>

      <div class="btn-action-row" v-if="showActionRow">
        <button
          class="btn btn-sm btn-secondary"
          :class="!showSecondaryAction && 'invisible'"
          @click="$emit('onSecondaryActionClicked')"
        >
          {{ secondaryActionText }}
        </button>

        <button
          class="btn btn-sm btn-primary"
          ref="btnRef"
          :disabled="isPrimaryActionDisabled"
          @click="triggerPrimaryActionClick"
        >
          {{ primaryActionText }}
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import useEvents from "@/shared/composables/useEvents";
import { useSettingsStore } from "../store";
import SkeletonDisplay from "@/modules/compliance/components/skeleton-display.vue";

interface ISettingsInfoType {
  title: string;
  description: string;
  showActionRow: boolean;
  primaryActionText?: string;
  showSecondaryAction?: boolean;
  isPrimaryActionDisabled?: boolean;
  secondaryActionText?: string;
  stopClickHandler?: boolean;
}

const emits = defineEmits(["onSecondaryActionClicked", "onContinueClick"]);

const props = withDefaults(defineProps<ISettingsInfoType>(), {
  title: "Document title",
  description: "Document description",
  showActionRow: false,
  primaryActionText: "Save Changes",
  isPrimaryActionDisabled: false,
  showSecondaryAction: false,
  secondaryActionText: "Cancel",
  stopClickHandler: false,
});

const { processAPIRequest, clickHandler } = useEvents();
const { fetchUserProfile } = useSettingsStore();

const btnRef = ref(null);
const isProfileLoading = ref<boolean>(true);

const triggerPrimaryActionClick = () => {
  clickHandler(btnRef);
  emits("onContinueClick");
};

watch(
  props,
  () => {
    if (props.stopClickHandler)
      clickHandler(btnRef, props.primaryActionText, false);
  },
  { deep: true }
);

// Fetch all profile data
const fetchProfileData = async () => {
  const response = await processAPIRequest({
    action: fetchUserProfile,
    payload: {},
    showAlert: false,
  });

  if (response.code === 200) isProfileLoading.value = false;
};

fetchProfileData();
</script>

<style lang="scss" scoped>
.settings-display-block {
  @apply mb-14;

  .content-top {
    @apply mb-10;

    &--title {
      @apply text-teal-900 text-xl xl:text-[18.5px] lg:text-[17.75px] sm:text-[16.5px] font-semibold mb-[6px];
    }

    &--description {
      @apply text-[14.5px] xl:text-[14px] sm:text-[13.75px] leading-6 sm:leading-[22.5px] text-grey-800/80;
    }
  }

  .btn-action-row {
    @apply flex justify-between items-center gap-x-6;

    .btn {
      @apply min-w-[130px] w-auto py-2.5 xs:text-[13.75px];
    }
  }
}
</style>
