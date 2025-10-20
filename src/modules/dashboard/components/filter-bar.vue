<template>
  <div class="filter-bar">
    <TextFieldInput
      :input-type="IInputType.Search"
      input-placeholder="Search by Invoice # or Customer"
      :has-bottom-padding="false"
      :input-value="localFilters.search"
      @input-changed="updateSearch"
    />

    <div class="filter-actions">
      <SelectFieldInput
        input-placeholder="Filter by Date ..."
        :has-bottom-padding="false"
        :select-data="dateFilters"
        :input-value="localFilters.filter"
        @on-selection-change="updateFilter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import {
  TextFieldInput,
  SelectFieldInput,
} from "@/shared/components/form-comps";

// --- INTERFACES ---
interface Filters {
  search: string;
  filter: string;
}

// --- COMPOSABLES ---
const route = useRoute();
const router = useRouter();

// --- REACTIVE STATE ---
const localFilters = ref<Filters>({
  search: (route.query.search as string) || "",
  filter: (route.query.filter as string) || "",
});

const dateFilters = ref([
  { value: "yesterday", name: "Yesterday" },
  { value: "past-7-days", name: "Past 7 days" },
  { value: "two-weeks-ago", name: "Two weeks ago" },
  { value: "last-month", name: "Last month" },
]);

// --- METHODS ---
const updateSearch = (value: string) => {
  localFilters.value.search = value;
  pushToRoute();
};

const updateFilter = (value: string) => {
  localFilters.value.filter = value;
  pushToRoute();
};

const pushToRoute = () => {
  // Make a plain mutable copy of route.query + local filters
  const query = {
    ...Object.fromEntries(Object.entries(route.query)), // ✅ ensure it's mutable
    ...localFilters.value,
  } as Record<string, any>; // ✅ cast to mutable object

  // Remove empty filter values
  if (!query.search) delete query.search;
  if (!query.filter) delete query.filter;

  router.push({ query });
};
</script>

<style lang="scss" scoped>
.filter-bar {
  @apply flex justify-between items-center mb-6 pb-6 border-b border-b-grey-100;

  .search-input {
    @apply max-w-sm;
  }

  .filter-actions {
    @apply flex items-center gap-x-2;

    .date-filter {
      @apply w-48;
    }
  }
}
</style>
