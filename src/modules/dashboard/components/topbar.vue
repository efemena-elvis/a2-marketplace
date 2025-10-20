<template>
  <div class="topbar">
    <div class="topbar--left">
      <div class="topbar--left-menu" @click="triggerMenuSidebar">
        <div class="icon icon-menu"></div>
      </div>

      <div class="topbar--left-wrapper">
        <div class="page-title">
          Welcome, <span class="business-name">{{ companyName }}</span>
        </div>
      </div>
    </div>

    <div class="topbar--right">
      <div class="icon-wrapper">
        <div class="icon-user"></div>
      </div>

      <div class="action-text" @click="handleLogout">Log Out</div>
    </div>
  </div>

  <PageOverlay loadingText="Logging out..." v-if="isPageLoading" />
</template>

<script lang="ts" setup>
import { inject, ref } from "vue";
import { Emitter } from "mitt";
import { useAuthStore } from "@/modules/auth/store";
import useEvents from "@/shared/composables/useEvents";
import { useProfile } from "@/shared/composables/useProfile";
import PageOverlay from "@/shared/components/global-comps/page-overlay.vue";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
};

const eventBus = inject<Emitter<Events>>("eventBus");

const { logoutUser } = useAuthStore();
const { processAPIRequest } = useEvents();

const { getUser } = useProfile();
const { companyName } = getUser();

const isPageLoading = ref<boolean>(false);

const triggerMenuSidebar = () => {
  eventBus?.emit("triggerSidebar");
};

const handleLogout = async () => {
  isPageLoading.value = true;

  const response = await processAPIRequest({
    action: logoutUser,
  });

  // if (response.status !== 200) {
  //   isPageLoading.value = false;
  // }
};
</script>

<style lang="scss" scoped>
.topbar {
  @apply relative px-8 xl:px-6 mdLg:px-4 py-[18px] mdLg:py-4 sm:py-2 flex justify-between items-center h-[82px] border-b border-b-grey-300/25;

  &--left {
    @apply flex justify-start items-center gap-x-2.5;

    &-menu {
      @apply hidden mdLg:block text-3xl sm:text-2xl cursor-pointer text-grey-500/90;
    }

    &-wrapper {
      @apply flex flex-col justify-center items-start mdLg:gap-y-0.5;

      .page-title {
        @apply relative text-[17.5px] mdLg:text-base sm:text-[15.25px] xs:text-[14.5px] xs:text-nowrap leading-[30px] xs:leading-[24px] xs:w-[150px] xxs:w-[130px] xs:overflow-hidden xs:text-ellipsis capitalize font-normal text-grey-700/80;

        .business-name {
          @apply font-semibold text-grey-900;
        }
      }
    }
  }

  &--right {
    @apply flex justify-end items-center gap-x-3 xs:gap-x-2.5 cursor-pointer;

    %card-wrapper {
      @apply relative rounded-full border border-grey-300/80 bg-grey-50/30 cursor-pointer transition duration-300 ease-in-out hover:bg-grey-100/50 hover:border-grey-400/70;
    }

    .icon-wrapper {
      @apply min-w-8 xs:min-w-[34px] min-h-8 xs:min-h-[34px] size-9 xs:size-[34px] flex justify-center items-center;
      @extend %card-wrapper;
    }
  }
}
</style>
