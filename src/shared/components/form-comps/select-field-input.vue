<template>
  <div
    :class="['form-block form-text-block', hasBottomPadding ? 'mb-8' : 'mb-0']"
  >
    <!-- LABEL TEXT -->
    <label
      v-if="labelTitle"
      :for="labelId"
      class="form-label"
      :class="inputBaseColor"
      >{{ labelTitle }}</label
    >
    <!-- inputBaseColor -->
    <div class="form-block-input">
      <select
        :id="labelId"
        :class="['form-control']"
        v-model="selectedValue"
        :required="isRequired"
        :disabled="isDisabled"
        @change="handleFormInput"
      >
        <option value="" disabled selected hidden>
          {{ inputPlaceholder }}
        </option>

        <option
          :value="item.value"
          v-for="(item, index) in selectData"
          :key="index"
        >
          {{ item.name }}
        </option>
      </select>

      <!-- CARET DOWN ICON -->
      <!-- <CaretDownIcon /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ISelectInputField } from "@/models/form-type";
// import CaretDownIcon from "@/shared/components/icon-comps/caret-down-icon.vue";

const emit = defineEmits(["onSelectionChange"]);

const props = withDefaults(defineProps<ISelectInputField>(), {
  labelId: "",
  labelTitle: "",
  inputValue: "",
  inputPlaceholder: "",
  inputBaseColor: "bg-neutral-10",
  isRequired: false,
  isDisabled: false,
  hasBottomPadding: true,
  selectData: () => [{ value: "", name: "" }],
});

const selectedValue = ref<string>(props.inputValue);

const handleFormInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedValue.value = target.value;

  emit("onSelectionChange", target.value);
};

watch(
  () => props.inputValue,
  (value) => (selectedValue.value = value),
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.form-text-block {
  .form-block-input {
    @apply relative;

    svg {
      @apply absolute z-50 right-4 top-5 w-5 h-5;
    }
  }
}
</style>
