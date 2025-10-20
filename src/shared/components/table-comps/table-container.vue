<template>
  <div class="w-full">
    <!-- TABLE LOADING STATE -->
    <TableLoading v-if="props.isLoading" />

    <template v-else>
      <div class="table-container-wrapper">
        <template v-if="true">
          <div class="table-container">
            <table class="table">
              <thead v-if="props.showTableHeader">
                <tr>
                  <!-- Checkbox -->
                  <td v-if="props.showCheckbox">
                    <input
                      type="checkbox"
                      class="sm-size relative top-0.5 ml-1"
                      :checked="isAllSelected"
                      @change="onCheckboxChange"
                    />
                  </td>

                  <!-- Table Headers -->
                  <td v-for="(header, index) in props.tableHeader" :key="index">
                    <div class="table-header">
                      <div>{{ header.title }}</div>
                      <div
                        v-if="header.sortable"
                        class="table-sort-icon icon-double-caret-fill"
                      ></div>
                    </div>
                  </td>
                </tr>
              </thead>

              <tbody v-if="props.tableBody.length">
                <slot />
              </tbody>
            </table>
          </div>
        </template>

        <!-- TABLE EMPTY STATE -->
        <TableEmpty
          v-if="!props.isLoading && !props.tableBody.length"
          :title="props.emptyData.title"
          :description="props.emptyData.description"
          :actionText="props.emptyData.actionText"
          :customImg="props.emptyData.customImg"
          @onActionClicked="emit('onActionClicked')"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import TableLoading from "@/shared/components/table-comps/table-loading.vue";
import TableEmpty from "@/shared/components/table-comps/table-empty.vue";
import { TableHeaderType } from "@/models/dashboard-type";

/* ---------------------------------------------------------
   📘 INTERFACES
--------------------------------------------------------- */
export interface EmptyDataType {
  title: string;
  description: string;
  actionText?: string;
  customImg?: string;
}

export interface TableContainerProps {
  tableHeader: TableHeaderType[];
  tableBody: any[];
  showTableHeader?: boolean;
  isLoading?: boolean;
  showCheckbox?: boolean;
  isChecked?: boolean;
  emptyData?: EmptyDataType;
}

/* ---------------------------------------------------------
   📦 EMITS
--------------------------------------------------------- */
const emit = defineEmits<{
  (e: "onActionClicked"): void;
  (e: "checkboxChange", checked: boolean): void;
}>();

/* ---------------------------------------------------------
   🧩 PROPS
--------------------------------------------------------- */
const props = withDefaults(defineProps<TableContainerProps>(), {
  tableHeader: () => [],
  tableBody: () => [],
  showTableHeader: true,
  isLoading: false,
  showCheckbox: false,
  isChecked: false,
  emptyData: () => ({
    title: "Not available",
    description: "No data available yet",
    actionText: "",
    customImg: "",
  }),
});

/* ---------------------------------------------------------
   🧠 STATE & METHODS
--------------------------------------------------------- */
const isAllSelected = ref<boolean>(props.isChecked || false);

const onCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  isAllSelected.value = target.checked;
  emit("checkboxChange", isAllSelected.value);
};

watch(
  () => props.isChecked,
  (newVal) => {
    isAllSelected.value = newVal;
  }
);
</script>

<style lang="scss">
.table-container-wrapper {
  @apply border border-grey-200/90 border-t-0 overflow-hidden rounded-lg;
}

.table-container {
  @apply overflow-auto w-full p-0;
}

.table-container::-webkit-scrollbar {
  @apply h-[5px];
}

.table-container::-webkit-scrollbar-track {
  @apply rounded-md;
}

.table-container::-webkit-scrollbar-thumb {
  @apply rounded-md;
}

.table {
  @apply overflow-auto w-full border-collapse min-w-max;
}

thead {
  @apply text-[13.5px] font-medium text-grey-900;
}

thead tr {
  @apply border-0 border-y border-y-grey-200/75 bg-grey-50/80;
}

thead tr td {
  @apply px-4 py-[18px];
}

thead tr td .table-header {
  @apply flex justify-start items-center font-medium;
}

thead tr td .table-header .table-sort-icon {
  @apply cursor-pointer text-[23px];
}

tbody {
  @apply text-[13.5px] text-grey-900;
}

tbody tr {
  @apply cursor-pointer align-middle transition duration-300 ease-in-out border-b border-b-grey-200/60 hover:bg-green-100/20 last-of-type:border-b-0;
}

tbody tr td {
  @apply p-4 w-auto;
  min-width: 24px;
  max-width: auto;
}
</style>
