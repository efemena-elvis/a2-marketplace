<template>
  <div class="profile-settings-card">
    <div class="card-header">
      <h2 class="card-title">Business Profile</h2>
      <p class="card-description">
        This information is used for compliance and reporting.
      </p>
    </div>

    <form @submit.prevent="handleUpdateProfile">
      <div class="card-body">
        <!-- Business Name -->
        <TextFieldInput
          label-id="businessName"
          label-title="Business Name"
          :input-type="IInputType.Text"
          :input-value="profile.businessName"
          input-placeholder="e.g., Megatech Enterprises"
        />

        <!-- Taxpayer Identification Number (TIN) -->
        <TextFieldInput
          label-id="businessTIN"
          label-title="Taxpayer Identification Number (TIN)"
          :input-type="IInputType.Text"
          :input-value="profile.tin"
          input-placeholder="e.g., 12345678-0001"
        />

        <!-- Business Registration Number (RC Number) -->
        <TextFieldInput
          label-id="businessRC"
          label-title="Business Registration Number (RC Number)"
          :input-type="IInputType.Text"
          :input-value="profile.rcNumber"
          input-placeholder="e.g., RC123456"
        />

        <!-- Company Logo Upload -->
        <div class="form-block">
          <label class="form-label-basic">Company Logo</label>
          <FileUploadInput />
        </div>
      </div>

      <div class="card-footer">
        <button
          class="btn btn-primary btn-md"
          type="submit"
          :disabled="isLoading"
        >
          <div
            v-if="isLoading"
            class="icon icon-spinner-ios animate-spin"
          ></div>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IInputType } from "@/models/form-type";
import {
  TextFieldInput,
  FileUploadInput,
} from "@/shared/components/form-comps";

// --- REACTIVE STATE ---
const profile = ref({
  businessName: "",
  tin: "",
  rcNumber: "",
  logoUrl: "",
});
const isLoading = ref(false);

// --- API LOGIC (MOCKED) ---
const fetchProfile = async () => {
  // In a real app: const data = await apiFetch('/app/profile');
  // Mocked data for demonstration
  profile.value = {
    businessName: "Megatech Enterprises",
    tin: "12345678-0001",
    rcNumber: "RC123456",
    logoUrl: "",
  };
};

const handleUpdateProfile = async () => {
  isLoading.value = true;
  try {
    console.log("Updating profile with:", profile.value);
    // In a real app: await apiFetch('/app/profile', { method: 'PUT', data: profile.value });
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("An error occurred while updating your profile.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style lang="scss" scoped>
.profile-settings-card {
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
  @apply px-6 py-8;
}

.card-footer {
  @apply p-6 bg-grey-50/50 border-t border-t-grey-200/80 flex justify-end;
}
</style>
