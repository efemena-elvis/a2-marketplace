<template>
  <AuthWrapper title_text="Create your Password">
    <form @submit.prevent="handleUserSignup">
      <!-- PASSWORD -->
      <TextFieldInput
        labelId="userPassword"
        labelTitle="Choose a password"
        :inputType="IInputType.Password"
        :inputValue="signupPayload.password"
        inputPlaceholder="Please enter your password"
        isRequired
        @inputChanged="signupPayload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <!-- PASSWORD -->
      <TextFieldInput
        labelId="retypePassword"
        labelTitle="Retype password"
        :inputType="IInputType.Password"
        :inputValue="signupPayload.password"
        inputPlaceholder="Please retype your password"
        isRequired
        @inputChanged="signupPayload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <button
        class="btn btn-primary w-full -mt-1"
        ref="signupBtnRef"
        :disabled="isSignupReady"
      >
        Create account
      </button>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { IInputType } from "@/models/form-type";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store";
import { useGeneralStore } from "@/store/general";
import useEvents from "@/shared/composables/useEvents";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type ISignupInputType = {
  password: string;
  retype_password: string;
};

type IInputValidity = {
  password: boolean;
  retype_password: boolean;
};

const signupPayload = ref<ISignupInputType>({
  password: "",
  retype_password: "",
});

const payloadValidity = ref<IInputValidity>({
  password: false,
  retype_password: false,
});

const router = useRouter();
const signupBtnRef = ref(null);

const { signupUser } = useAuthStore();
const { getBusinessCountries } = useGeneralStore();
const { processAPIRequest } = useEvents();

const isSignupReady = computed(() => {
  return signupPayload.value.password &&
    signupPayload.value.retype_password &&
    payloadValidity.value.password &&
    payloadValidity.value.retype_password
    ? false
    : true;
});

const getSignupPayload = computed(() => {
  const { password, retype_password } = signupPayload.value;
  return { password, retype_password };
});

const handleUserSignup = async () => {
  // const response = await processAPIRequest({
  //   action: signupUser,
  //   payload: getSignupPayload.value,
  //   btnRef: signupBtnRef,
  //   btnText: "Create your account",
  //   alertHandler: {
  //     201: {
  //       message: "Merchant account created",
  //       description: "Proceed to verify your account email address",
  //       type: "success",
  //     },
  //     400: {
  //       message: "Account creation failed",
  //       type: "error",
  //     },
  //   },
  // });
  // REDIRECT TO EMAIL VERIFICATION PAGE
  // if (response.code === 201) {
  //   setTimeout(() => {
  //     router.push({
  //       name: "RedstoneVerifyEmail",
  //       query: { email: encodeURIComponent(signupPayload.value.email) },
  //     });
  //     localStorage.clear();
  //   }, 2000);
  // }
};
</script>
