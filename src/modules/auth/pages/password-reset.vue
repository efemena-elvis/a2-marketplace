<template>
  <AuthWrapper title_text="Confirm password reset">
    <form @submit.prevent="handleUserPasswordReset">
      <!-- PASSWORD -->
      <TextFieldInput
        labelId="password"
        labelTitle="New password"
        :inputType="IInputType.Password"
        :inputValue="payload.password"
        inputPlaceholder="Please enter a new password"
        :isRequired="true"
        @inputChanged="payload.password = $event"
        @inputValidated="payloadValidity.password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <!-- CONFIRM PASSWORD -->
      <TextFieldInput
        labelId="confirmPassword"
        labelTitle="Confirm password"
        :inputType="IInputType.Password"
        :inputValue="payload.confirm_password"
        inputPlaceholder="Please confirm new password"
        :isRequired="true"
        @inputChanged="payload.confirm_password = $event"
        @inputValidated="payloadValidity.confirm_password = $event"
        :errorHandler="{
          validator: 'validatePasswordStrength',
        }"
      />

      <button
        class="btn btn-primary w-full"
        ref="btnRef"
        :disabled="isActionReady"
      >
        Reset password
      </button>

      <div class="helper-row justify-center mt-5">
        <div class="text">
          Remember your old password?
          <router-link to="/login">Login</router-link>
        </div>
      </div>
    </form>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { IInputType } from "@/models/form-type";
import { useAuthStore } from "../store";
import useEvents from "@/shared/composables/useEvents";
import AuthWrapper from "@/modules/auth/components/auth-wrapper.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";

type IPayloadInputType = {
  password: string;
  confirm_password: string;
};

type IPayloadValidity = {
  password: boolean;
  confirm_password: boolean;
};

const payload = ref<IPayloadInputType>({
  password: "",
  confirm_password: "",
});

const payloadValidity = ref<IPayloadValidity>({
  password: false,
  confirm_password: false,
});

const route = useRoute();
const btnRef = ref(null);

const { resetUserPassword } = useAuthStore();
const { pushToastAlert, processAPIRequest } = useEvents();

const isActionReady = computed(() => {
  return payload.value.password &&
    payload.value.confirm_password &&
    payloadValidity.value.password &&
    payloadValidity.value.confirm_password
    ? false
    : true;
});

const getRouteToken = computed(() => route.params.token);

const getPayload = computed(() => {
  const { password } = payload.value;
  return { password, token: getRouteToken.value };
});

const handleUserPasswordReset = async () => {
  if (payload.value.password !== payload.value.confirm_password) {
    pushToastAlert({ message: "Passwords do not match", type: "warning" });
    return;
  }

  const response = await processAPIRequest({
    action: resetUserPassword,
    payload: getPayload.value,
    btnRef: btnRef,
    btnText: "Reset password",
    alertHandler: {
      200: {
        message: "Password reset was successful",
        type: "success",
      },

      400: {
        message: "Password reset failed",
        description: "Unable to reset password at this time",
        type: "error",
      },
    },
  });

  if (response.code === 200) {
    setTimeout(() => (location.href = "/"), 1200);
  }
};
</script>
