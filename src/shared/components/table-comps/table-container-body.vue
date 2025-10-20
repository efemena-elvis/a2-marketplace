<template>
  <tr @click="handleTableRowClicked">
    <td v-if="props.showCheckbox">
      <input
        type="checkbox"
        :checked="isRowSelected"
        class="sm-size ml-1 checkbox-select-input"
      />
    </td>

    <td v-for="(header, index) in props.tableHeader" :key="index">
      <div
        :class="[
          header.tableDataClass || '',
          renderLogicClass(header, props.tableData[header.slug] ?? ''),
        ]"
      >
        <template v-if="isVNode(props.tableData[header.slug])">
          <component :is="props.tableData[header.slug]" />
        </template>

        <template v-else>
          <span
            v-if="isHtmlString(props.tableData[header.slug])"
            v-html="props.tableData[header.slug] as string"
          />
          <span v-else>{{ props.tableData[header.slug] }}</span>
        </template>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { isVNode, ref, watch } from "vue";
import { TableHeaderType } from "@/models/dashboard-type";

/* -----------------------------
   Interfaces (reuse or import)
   ----------------------------- */
export interface TableRowProps {
  tableHeader: TableHeaderType[];
  tableData: Record<string, any>;
  showCheckbox?: boolean;
  isChecked?: boolean;
  onTableClicked?: (item: any) => void;
  slugKey?: string; // key in tableData used as unique identifier (default: 'id')
}

/* -----------------------------
   Props & Emits
   ----------------------------- */
const props = withDefaults(defineProps<TableRowProps>(), {
  showCheckbox: false,
  isChecked: false,
  slugKey: "id",
});

const emit = defineEmits<{
  (e: "onActionClicked"): void;
  (e: "checkboxRowChange", checked: boolean): void;
}>();

const isRowSelected = ref(false);

/* -----------------------------
   Helper functions (typed)
   ----------------------------- */
const isHtmlString = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return pattern.test(value);
};

const renderLogicClass = (
  headerData: TableHeaderType,
  tableCell: unknown
): string => {
  if (!headerData?.tableLogicClass) return "";
  const key = String(tableCell ?? "");
  return headerData.tableLogicClass[key] ?? "";
};

/* -----------------------------
   Click handler & mount
   ----------------------------- */
const handleTableRowClicked = (ev: MouseEvent) => {
  const target = ev.target as HTMLInputElement;

  if (props.showCheckbox) {
    if (target && target.classList.contains("checkbox-select-input")) {
      isRowSelected.value = target.checked;
      emit("checkboxRowChange", isRowSelected.value);
    }
  }
};

watch(
  () => props.isChecked,
  (newVal) => {
    isRowSelected.value = newVal;
  }
);
</script>

<style scoped></style>
