<template>
  <SettingsDisplayBlock
    title="Business Profile"
    description="This information is used for compliance and reporting."
    action-text="Save Changes"
    :is-action-loading="isLoading"
    @form-submitted="handleUpdateProfile"
  >
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
    <div class="form-block" v-if="false">
      <label class="form-label-basic">Company Logo</label>
      <FileUploadInput />
    </div>
  </SettingsDisplayBlock>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IInputType } from "@/models/form-type";
import {
  TextFieldInput,
  FileUploadInput,
} from "@/shared/components/form-comps";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";

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

<style lang="scss" scoped></style>
