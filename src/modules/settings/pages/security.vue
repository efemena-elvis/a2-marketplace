<template>
  <SettingsDisplayBlock
    title="Change Password"
    description="Update your password regularly to keep your account secure."
    action-text="Update Password"
    :is-action-loading="isUpdatingPassword"
    @form-submitted="handleChangePassword"
  >
    <TextFieldInput
      label-title="Current Password"
      input-placeholder="Enter your current password"
      :input-type="IInputType.Password"
      v-model:input-value="passwordData.currentPassword"
      class="mb-6"
    />

    <!-- New Password -->
    <TextFieldInput
      label-title="New Password"
      input-placeholder="Enter your new password"
      :input-type="IInputType.Password"
      v-model:input-value="passwordData.newPassword"
      class="mb-6"
    />

    <!-- Confirm New Password -->
    <TextFieldInput
      label-title="Confirm New Password"
      input-placeholder="Confirm your new password"
      :input-type="IInputType.Password"
      v-model:input-value="passwordData.confirmPassword"
    />
  </SettingsDisplayBlock>

  <SettingsDisplayBlock
    title="Two-Factor Authentication (2FA)"
    description="Add an extra layer of security to your account during login."
    action-text="Enable 2FA"
    :is-action-loading="isUpdating2FA"
    @form-submitted="handleChange2FA"
  >
    <div class="two-fa-status">
      <div class="status-indicator-disabled"></div>
      <span>2FA is currently <strong>Disabled</strong></span>
    </div>

    <p class="two-fa-text mb-6">
      When enabled, you'll be asked for a phone verification code each time you
      log in.
    </p>
  </SettingsDisplayBlock>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IInputType } from "@/models/form-type";
import { TextFieldInput } from "@/shared/components/form-comps";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";

// --- REACTIVE STATE ---
const passwordData = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const isUpdatingPassword = ref(false);
const isUpdating2FA = ref(false);

// --- API LOGIC (MOCKED) ---
const handleChangePassword = async () => {
  // Simple frontend validation
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    alert("New password and confirmation password do not match.");
    return;
  }
  if (passwordData.value.newPassword.length < 8) {
    alert("New password must be at least 8 characters long.");
    return;
  }

  isUpdatingPassword.value = true;
  try {
    console.log("Updating password...");
    // In a real app: await apiFetch('/app/account/change-password', { method: 'POST', data: passwordData.value });
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    alert("Password updated successfully!");
    // Clear form fields on success
    passwordData.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (error) {
    console.error("Failed to update password:", error);
    alert("An error occurred while updating your password.");
  } finally {
    isUpdatingPassword.value = false;
  }
};

const handleChange2FA = async () => {
  isUpdating2FA.value = true;
  try {
    console.log("Enabling 2FA...");
    // In a real app: await apiFetch('/app/account/enable-2fa', { method: 'POST' });
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    alert("2FA enabled successfully!");
  } catch (error) {
    console.error("Failed to enable 2FA:", error);
    alert("An error occurred while enabling 2FA.");
  } finally {
    isUpdating2FA.value = false;
  }
};
</script>

<style lang="scss" scoped>
// 2FA Specific Styles
.two-fa-status {
  @apply flex items-center gap-x-3 mb-2;
  .status-indicator-disabled {
    @apply size-3 bg-red-500 rounded-full;
  }
  span {
    @apply text-grey-800;
  }
}

.two-fa-text {
  @apply text-sm text-grey-600;
}
</style>
