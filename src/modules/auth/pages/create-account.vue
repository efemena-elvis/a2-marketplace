<template>
  <AuthWrapper title_text="Provide your Business Details">
    <form @submit.prevent="handleUserSignup">
      <!-- BUSINESS TIN NUMBER -->
      <TextFieldInput
        labelId="tinNumber"
        labelTitle="Tax Identification Number (TIN)"
        :inputType="IInputType.Text"
        :inputValue="signupPayload.tin_number"
        inputPlaceholder="Provide a tax identification number"
        isRequired
        @inputChanged="signupPayload.tin_number = $event"
        @inputValidated="payloadValidity.tin_number = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business TIN is a required field',
        }"
      />

      <!-- BUSINESS RC NUMBER -->
      <TextFieldInput
        labelId="rcNumber"
        labelTitle="Registration Certificate (RC) Number"
        :inputType="IInputType.Text"
        :inputValue="signupPayload.rc_number"
        inputPlaceholder="Provide a registration certificate number"
        isRequired
        @inputChanged="signupPayload.rc_number = $event"
        @inputValidated="payloadValidity.rc_number = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Business RC is a required field',
        }"
      />

      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        :inputValue="signupPayload.email"
        inputPlaceholder="hello@companyname.com"
        isRequired
        @inputChanged="signupPayload.email = $event"
        @inputValidated="payloadValidity.email = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <!-- PASSWORD -->
      <!-- <TextFieldInput
        labelId="userPassword"
        labelTitle="Choose a password"
        :inputType="IInputType.Password"
        :inputValue="signupPayload.password"
        inputPlaceholder="Please enter your password"
        :hasBottomPadding="false"
        isRequired
        @inputChanged="signupPayload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      /> -->

      <button
        class="btn btn-primary w-full -mt-1"
        ref="signupBtnRef"
        :disabled="isSignupReady"
      >
        Get Access
      </button>

      <!-- <div class="helper-row justify-center mt-5">
        <div class="text">
          Already have an account?
          <router-link :to="{ name: 'RedstoneLogin' }">Login</router-link>
        </div>
      </div> -->
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
  tin_number: string;
  rc_number: string;
  email: string;
};

type IInputValidity = {
  rc_number: boolean;
  tin_number: boolean;
  email: boolean;
};

const signupPayload = ref<ISignupInputType>({
  tin_number: "",
  rc_number: "",
  email: "",
});

const payloadValidity = ref<IInputValidity>({
  tin_number: false,
  rc_number: false,
  email: false,
});

const router = useRouter();
const signupBtnRef = ref(null);

const { signupUser } = useAuthStore();
const { getBusinessCountries } = useGeneralStore();
const { processAPIRequest } = useEvents();

const isSignupReady = computed(() => {
  return signupPayload.value.email &&
    signupPayload.value.tin_number &&
    signupPayload.value.rc_number &&
    payloadValidity.value.email &&
    payloadValidity.value.tin_number &&
    payloadValidity.value.rc_number
    ? false
    : true;
});

const getSignupPayload = computed(() => {
  const { email, tin_number, rc_number } = signupPayload.value;
  return { email, tin_number, rc_number };
});

const handleUserSignup = async () => {
  router.push({ name: "CreatePassword" });

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
