<template>
  <AuthWrapper title_text="Welcome to CISL">
    <form @submit.prevent="handleUserLogin">
      <!-- EMAIL ADDRESS -->
      <TextFieldInput
        labelId="businessEmail"
        labelTitle="Email address"
        :inputType="IInputType.Email"
        inputPlaceholder="hello@companyname.com"
        :isRequired="true"
        @inputChanged="loginPayload.email = $event"
        @inputValidated="emailValidity = $event"
        :errorHandler="{
          validator: 'validateEmail',
        }"
      />

      <!-- PASSWORD -->
      <TextFieldInput
        labelId="userPassword"
        labelTitle="Password"
        :inputType="IInputType.Password"
        inputPlaceholder="Please enter your password"
        :isRequired="true"
        :hasBottomPadding="false"
        @inputChanged="loginPayload.password = $event"
        :errorHandler="{
          validator: 'validateRequired',
          message: 'Password is a required field',
        }"
      />

      <div class="helper-row mt-3 mb-7">
        <div class="text">
          Forgot your password?
          <router-link :to="{ name: 'PasswordRequest' }">Reset it</router-link>
        </div>
      </div>

      <button
        class="btn btn-primary w-full"
        ref="loginBtnRef"
        :disabled="isLoginReady"
      >
        Login to your dashboard
      </button>

      <!-- <div class="helper-row justify-center mt-5">
        <div class="text">
          Don't have an account yet?
          <router-link :to="{ name: 'RedstoneCreateAccount' }"
            >Create account</router-link
          >
        </div>
      </div> -->
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { IInputType } from "@/models/form-type";
import { useAuthStore } from "@/modules/auth/store";
import useEvents from "@/shared/composables/useEvents";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type ILoginInputType = {
  email: string;
  password: string;
};

const loginPayload = ref<ILoginInputType>({
  email: "",
  password: "",
});

const emailValidity = ref<boolean>(false);
const loginBtnRef = ref(null);

const { loginUser } = useAuthStore();
const { processAPIRequest } = useEvents();

const isLoginReady = computed(() => {
  return loginPayload.value.email &&
    loginPayload.value.password &&
    emailValidity.value
    ? false
    : true;
});

const getLoginPayload = computed(() => {
  const { email, password } = loginPayload.value;
  return { email_address: email, password };
});

const handleUserLogin = async () => {
  const response = await processAPIRequest({
    action: loginUser,
    payload: getLoginPayload.value,
    btnRef: loginBtnRef,
    btnText: "Login to your dashboard",
    alertHandler: {
      200: {
        message: "Account login successful",
        description: "You are being redirected to your dashboard",
        type: "success",
      },
      400: {
        message: "Account login failed",
        description: "Incorrect email address or password combination",
        type: "error",
      },
    },
  });

  if (response.status === 200) {
    location.href = "/dashboard";
  }
};
</script>
