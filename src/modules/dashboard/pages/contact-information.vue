<template>
  <div class="contact-settings-card">
    <div class="card-header">
      <h2 class="card-title">Contact Information</h2>
      <p class="card-description">
        Manage the primary contact details for your business account.
      </p>
    </div>

    <form @submit.prevent="handleUpdateContactInfo">
      <div class="card-body">
        <div class="form-grid">
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
        </div>

        <!-- Phone Number -->
        <PhoneFieldInput
          label-id="generalPhone"
          label-title="Phone Number"
          input-placeholder="800 000 0000"
          v-model:input-value="contactInfo.phone"
        />

        <!-- Business Address -->
        <TextFieldInput
          label-id="businessAddress"
          label-title="Business Address"
          :input-type="IInputType.Text"
          input-placeholder="123 Compliance Street, Lagos"
          is-text-area
          v-model:input-value="contactInfo.address"
        />
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
  PhoneFieldInput,
} from "@/shared/components/form-comps";

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

<style lang="scss" scoped>
.contact-settings-card {
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

.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-x-6;
  // Use mb-6 on the grid for spacing, so the inputs inside don't need it.
  .form-block {
    @apply mb-9;
  }
}

.card-footer {
  @apply p-6 bg-grey-50/50 border-t border-t-grey-200/80 flex justify-end;
}
</style>
