<template>
  <SettingsDisplayBlock
    title="Contact Information"
    description="Manage the primary contact details for your business account."
    action-text="Save Changes"
    :is-action-loading="isLoading"
    @form-submitted="handleUpdateContactInfo"
  >
    <!-- Contact Person Name -->
    <TextFieldInput
      label-id="contactName"
      label-title="Contact Person"
      :input-type="IInputType.Text"
      input-placeholder="e.g., Jane Doe"
      v-model:input-value="contactInfo.contactName"
    />

    <!-- General Email Address -->
    <TextFieldInput
      label-id="generalEmail"
      label-title="Business Email Address"
      :input-type="IInputType.Email"
      input-placeholder="e.g., info@megatech.com"
      v-model:input-value="contactInfo.generalEmail"
    />

    <!-- Phone Number -->
    <PhoneFieldInput
      label-id="generalPhone"
      label-title="Phone Number"
      input-placeholder="800 000 0000"
      v-model:input-value="contactInfo.phone"
    />

    <!-- Business Address -->
    <TextFieldInput
      v-if="false"
      label-id="businessAddress"
      label-title="Business Address"
      :input-type="IInputType.Text"
      input-placeholder="123 Compliance Street, Lagos"
      is-text-area
      v-model:input-value="contactInfo.address"
    />
  </SettingsDisplayBlock>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IInputType } from "@/models/form-type";
import {
  TextFieldInput,
  PhoneFieldInput,
} from "@/shared/components/form-comps";
import SettingsDisplayBlock from "@/modules/settings/components/settings-display-block.vue";

// --- REACTIVE STATE ---
const contactInfo = ref({
  contactName: "",
  generalEmail: "",
  phone: "",
  address: "",
});
const isLoading = ref(false);

// --- API LOGIC (MOCKED) ---
const fetchContactInfo = async () => {
  // In a real app: const data = await apiFetch('/app/contact-info');
  // Mocked data for demonstration
  contactInfo.value = {
    contactName: "John Doe",
    generalEmail: "contact@megatech.com",
    phone: "8012345678",
    address: "15, Innovation Drive, Yaba, Lagos",
  };
};

const handleUpdateContactInfo = async () => {
  isLoading.value = true;
  try {
    console.log("Updating contact info with:", contactInfo.value);
    // In a real app: await apiFetch('/app/contact-info', { method: 'PUT', data: contactInfo.value });
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    alert("Contact information updated successfully!");
  } catch (error) {
    console.error("Failed to update contact info:", error);
    alert("An error occurred while updating your contact information.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchContactInfo();
});
</script>

<style lang="scss" scoped></style>
