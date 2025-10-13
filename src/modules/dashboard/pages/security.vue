<template>
  <div class="security-settings-page">
    <!-- CARD 1: CHANGE PASSWORD -->
    <div class="security-card">
      <div class="card-header">
        <h2 class="card-title">Change Password</h2>
        <p class="card-description">
          Update your password regularly to keep your account secure.
        </p>
      </div>

      <form @submit.prevent="handleChangePassword">
        <div class="card-body">
          <!-- Current Password -->
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
        </div>

        <div class="card-footer">
          <button
            class="btn btn-primary btn-md"
            type="submit"
            :disabled="isUpdatingPassword"
          >
            <div
              v-if="isUpdatingPassword"
              class="icon icon-spinner-ios animate-spin"
            ></div>
            <span v-else>Update Password</span>
          </button>
        </div>
      </form>
    </div>

    <!-- CARD 2: TWO-FACTOR AUTHENTICATION (Placeholder for future) -->
    <div class="security-card">
      <div class="card-header">
        <h2 class="card-title">Two-Factor Authentication (2FA)</h2>
        <p class="card-description">
          Add an extra layer of security to your account during login.
        </p>
      </div>
      <div class="card-body">
        <div class="two-fa-status">
          <div class="status-indicator-disabled"></div>
          <span>2FA is currently <strong>Disabled</strong></span>
        </div>
        <p class="two-fa-text">
          When enabled, you'll be asked for a phone verification code each time
          you log in.
        </p>
      </div>
      <div class="card-footer">
        <button class="btn btn-secondary btn-md" disabled>Enable 2FA</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IInputType } from "@/models/form-type";
import { TextFieldInput } from "@/shared/components/form-comps";

// --- REACTIVE STATE ---
const passwordData = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const isUpdatingPassword = ref(false);

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
</script>

<style lang="scss" scoped>
.security-settings-page {
  @apply flex flex-col gap-y-8;
}

.security-card {
  @apply bg-neutral-10 rounded-xl border border-grey-200/80;
}

.card-header {
  @apply p-6 border-b border-b-grey-200/80;
  .card-title {
    @apply text-lg font-semibold text-grey-900;
  }
  .card-description {
    @apply text-sm text-grey-600 mt-1;
  }
}

.card-body {
  @apply p-6;
}

.card-footer {
  @apply p-6 bg-grey-50/50 border-t border-t-grey-200/80 flex justify-end;
}

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
