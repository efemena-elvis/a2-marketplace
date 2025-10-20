<template>
  <div class="tabs-container">
    <router-link
      v-for="(tab, index) in tabs"
      :key="index"
      :to="tab.link"
      :class="['tab-item', { 'tab-item--active': isActiveTab(tab) }]"
    >
      {{ tab.label }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

/* ---------------------------------------------------------
   🧩 INTERFACES
--------------------------------------------------------- */
interface ITabBar {
  tabs: {
    label: string;
    link: string;
  }[];
}

/* ---------------------------------------------------------
   🧩 PROPS
--------------------------------------------------------- */
withDefaults(defineProps<ITabBar>(), {
  tabs: () => [],
});

/* ---------------------------------------------------------
   🧩 REFS / ROUTE
--------------------------------------------------------- */
const route = useRoute();

/* ---------------------------------------------------------
   🧩 HELPERS
--------------------------------------------------------- */
const isActiveTab = (tab: { label: string; link: string }) => {
  // Match active route path to the tab link
  return route.path === tab.link;
};
</script>

<style lang="scss" scoped>
.tabs-container {
  @apply flex items-center border-b border-b-grey-200 mb-6;

  .tab-item {
    @apply px-4 py-3 text-sm font-medium text-grey-500 border-b-2 border-transparent -mb-px transition-colors duration-200;

    &--active {
      @apply text-primary-900 border-b-primary-900;
    }
  }
}
</style>
