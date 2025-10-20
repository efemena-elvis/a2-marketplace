<template>
  <div class="otp-field-input">
    <div class="input-row">
      <input
        v-for="(_, index) in otpFields"
        :key="index"
        :ref="(el) => setOtpRef(el, index)"
        v-model="otpFields[index]"
        type="number"
        inputmode="numeric"
        class="form-control"
        :class="{ '!border-primary-700': otpFields[index] }"
        :maxlength="1"
        :data-index="index"
        @paste="handlePaste($event)"
        @input="moveFieldFocus(index)"
        @keydown.delete="handleBackspace(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";

const props = withDefaults(defineProps<{ otpFields?: number }>(), {
  otpFields: 7,
});

const emits = defineEmits(["otpChanged"]);

const otpFields = ref(Array(props.otpFields).fill(""));
const otpRefs = ref<(HTMLInputElement | null)[]>([]);

const getOTPToken = computed(() => otpFields.value.join(""));

// Initialize the refs array
const setOtpRef = (el: any, index: number) => {
  otpRefs.value[index] = el;
};

const moveFieldFocus = (index: number) => {
  let val = otpFields.value[index];

  // Keep only the first digit (handle pasting or multiple input)
  if (val.length > 1) {
    val = val.charAt(0);
    otpFields.value[index] = val;
  }

  // If a digit (including 0) is entered, move focus to the next field
  if (val !== "" && index < otpFields.value.length - 1) {
    nextTick(() => {
      otpRefs.value[index + 1]?.focus();
    });
  }

  // If it's the last input and filled, blur it
  if (index === otpFields.value.length - 1 && val !== "") {
    nextTick(() => {
      otpRefs.value[index]?.blur();
    });
  }

  // SEND INPUTED OTP CODE
  emits("otpChanged", getOTPToken.value);
};

const handleBackspace = (index: number) => {
  if (otpFields.value[index] === "" && index > 0) {
    nextTick(() => {
      otpRefs.value[index - 1]?.focus();
    });
  }
};

// Handle OTP paste
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData("text/plain").trim() || "";
  const otpValues = pastedData
    .replace(/\D/g, "")
    .slice(0, otpFields.value.length)
    .split("");

  otpValues.forEach((value, index) => {
    otpFields.value[index] = value;
  });

  // Blur last field after paste
  const lastFilledIndex = otpValues.length - 1;

  if (lastFilledIndex === otpFields.value.length - 1) {
    nextTick(() => otpRefs.value[lastFilledIndex]?.blur());
  } else if (lastFilledIndex < otpFields.value.length - 1) {
    nextTick(() => otpRefs.value[lastFilledIndex + 1]?.focus());
  }
};

// Focus the first input when component mounts
onMounted(async () => {
  otpRefs.value[0]?.focus();
});
</script>

<style lang="scss" scoped>
.otp-field-input {
  @apply w-auto flex justify-center items-center mx-auto;

  .input-row {
    @apply mx-auto flex justify-center items-start gap-x-3 mdLg:gap-x-2 mb-5;

    .form-control {
      @apply size-12 min-w-12 min-h-12 text-center text-xl font-bold text-grey-700 focus:shadow-sm;
    }
  }
}
</style>
