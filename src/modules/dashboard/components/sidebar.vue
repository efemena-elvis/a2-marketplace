<template>
  <div class="base-sidebar">
    <!-- BUSINESS LOGO -->
    <div class="business-logo">
      <img :src="renderImg('a2-logo.png')" alt="Business Logo" />
      <div class="brand-name">A2 Marketplace</div>
    </div>

    <!-- SIDEBAR ITEMS AREA -->
    <div class="sidebar-items-area">
      <div class="sidebar-item-group" v-if="sidebarRouteList.length">
        <template v-for="route in sidebarRouteList">
          <router-link
            :to="route.link"
            activeClass="sidebar-item--active"
            exactActiveClass="sidebar-item--active"
            class="sidebar-item"
          >
            <div class="icon" :class="route.icon"></div>
            <div class="sidebar-text">{{ route.title }}</div>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { sidebarRoutes } from "@/shared/constants/sidebar-routes";
import { useString } from "@/shared/composables/useString";
import { IRouteGroupType } from "@/models/route-type";

const appRoute = useRoute();
const { renderImg } = useString();

const sidebarRouteList = ref<IRouteGroupType[]>(sidebarRoutes);
</script>

<style lang="scss" scoped>
.base-sidebar {
  @apply relative bg-[#97B5E5]/80 h-full;
  z-index: 6999;

  .business-logo {
    @apply flex justify-start items-center gap-x-2 pt-6 px-6;

    img {
      @apply size-10 object-contain;
    }

    .brand-name {
      @apply text-primary-900 font-medium text-base;
    }
  }

  .sidebar-items-area {
    @apply absolute top-0 pt-[108px] pb-28 w-full h-screen overflow-auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .sidebar-item-group {
      @apply relative mb-[24px];

      &-title {
        @apply px-4 text-[11.75px] mb-[6px] uppercase text-gray-100/60;
      }
    }
  }

  .sidebar-bottom-area {
    @apply absolute w-full bottom-0 bg-teal-800 py-4 border-t border-t-grey-400/25;
  }

  .sidebar-item {
    @apply w-full px-6 py-3.5 text-primary-900 flex justify-start items-center gap-x-[12px] transition duration-300 ease-in-out hover:bg-primary-400/50;

    .icon {
      @apply text-[17px];
    }

    .sidebar-text {
      @apply text-base font-medium;
    }

    &--active {
      @apply bg-neutral-10;
    }
  }
}
</style>
