<template>
  <PageLayout
    title="Invoice Compliance"
    description="Review invoices with a generated IRN. Submit valid invoices to FIRS or review errors for those that require attention."
    :show-action-btn="false"
  >
    <!-- TABLE SECTION -->
    <div class="table-section">
      <!-- FILTER BAR -->
      <FilterBar />

      <!-- TAB BAR -->
      <TabBar :tabs="tabs" />

      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "@/shared/components/global-comps/page-layout.vue";
import FilterBar from "../components/filter-bar.vue";
import TabBar from "../components/tab-bar.vue";

const tabs = [
  {
    label: "Ready for Submission",
    link: "/invoice-compliance/valid",
  },
  {
    label: "Requires Attention",
    link: "/invoice-compliance/invalid",
  },
];
</script>

<style lang="scss" scoped>
.table-section {
  @apply bg-neutral-10 p-6 sm:p-4 rounded-xl border border-grey-200/80;
}
</style>
