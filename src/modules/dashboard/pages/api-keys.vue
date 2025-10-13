<template>
  <div class="api-keys-page">
    <!-- MAIN CARD -->
    <div class="api-keys-card">
      <div class="card-header">
        <h2 class="card-title">API Keys</h2>
        <p class="card-description">
          Manage API keys to connect your service providers and external
          applications.
        </p>
      </div>

      <div class="card-body">
        <!-- LOADING STATE -->
        <div v-if="isLoading" class="loading-state">
          <div
            class="icon icon-spinner-ios text-4xl animate-spin text-primary-500"
          ></div>
          <p>Loading API Keys...</p>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="!apiKeys.length" class="empty-state">
          <div class="icon-wrapper">
            <div class="icon icon-tool text-4xl text-primary-800"></div>
          </div>
          <h3 class="empty-title">No API Keys Generated</h3>
          <p class="empty-description">
            Generate an API Key to enable connections with service providers.
          </p>
          <button
            class="btn btn-primary btn-md mt-4"
            @click="handleGenerateKey"
            :disabled="isGenerating"
          >
            <div
              v-if="isGenerating"
              class="icon icon-spinner-ios animate-spin"
            ></div>
            <span v-else>Generate New API Key</span>
          </button>
        </div>

        <!-- DATA STATE: LIST OF KEYS -->
        <div v-else class="keys-list-container">
          <div class="list-header">
            <span>Your API Keys</span>

            <button
              class="btn btn-primary btn-sm"
              @click="handleGenerateKey"
              :disabled="isGenerating"
            >
              <div
                v-if="isGenerating"
                class="icon icon-spinner-ios animate-spin"
              ></div>
              <span v-else>Generate New Key</span>
            </button>
          </div>

          <ul class="keys-list">
            <li v-for="key in apiKeys" :key="key.id" class="key-item">
              <div class="key-details">
                <span class="key-masked">{{ key.maskedKey }}</span>
                <span class="key-date"
                  >Created on {{ formatDate(key.createdAt) }}</span
                >
              </div>
              <button
                class="btn btn-alert btn-sm"
                @click="openRevokeModal(key)"
                :disabled="isRevoking === key.id"
              >
                <div
                  v-if="isRevoking === key.id"
                  class="icon icon-spinner-ios animate-spin"
                ></div>
                <span v-else>Revoke</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- MODAL 1: DISPLAY NEWLY GENERATED KEY -->
    <ModalDialog
      v-if="showKeyModal"
      @close-modal="closeKeyModal"
      size="modal-md"
    >
      <template #modal-cover-header>
        <div class="modal-cover-header">
          <h3 class="modal-cover-title">API Key Generated Successfully</h3>
          <p class="modal-cover-meta text-yellow-700 font-medium">
            Please copy this secret key and store it securely. You will not be
            able to see it again.
          </p>
        </div>
      </template>

      <template #modal-cover-body>
        <div class="modal-cover-body">
          <TextFieldInput
            label-id="apiKey"
            label-title="API Key"
            :input-type="IInputType.Text"
            :input-value="newlyGeneratedKey"
            :show-text-copy="true"
            :is-disabled="true"
            :has-bottom-padding="false"
          />
        </div>
      </template>
      <template #modal-cover-footer>
        <div class="modal-cover-footer flex justify-end">
          <button class="btn btn-primary btn-md" @click="closeKeyModal">
            Done
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- MODAL 2: REVOKE CONFIRMATION -->
    <ModalDialog
      v-if="showRevokeModal"
      @close-modal="showRevokeModal = false"
      size="modal-sm"
    >
      <template #modal-cover-header>
        <div class="modal-cover-header">
          <h3 class="modal-cover-title">Revoke API Key?</h3>
          <p class="modal-cover-meta">
            Are you sure you want to revoke this key? Any applications using it
            will immediately lose access. This action cannot be undone.
          </p>
        </div>
      </template>
      <template #modal-cover-footer>
        <div class="modal-cover-footer flex justify-end gap-x-3">
          <button
            class="btn btn-secondary btn-md"
            @click="showRevokeModal = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-alert btn-md"
            @click="handleRevokeKey"
            :disabled="isRevoking"
          >
            <div
              v-if="isRevoking"
              class="icon icon-spinner-ios animate-spin"
            ></div>
            <span v-else>Yes, Revoke</span>
          </button>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import ModalDialog from "@/shared/components/global-comps/modal-dialog.vue";
import { IInputType } from "@/models/form-type";

// --- INTERFACES AND TYPES ---
interface ApiKey {
  id: string;
  maskedKey: string;
  createdAt: string;
}

// --- REACTIVE STATE ---
const isLoading = ref(true);
const isGenerating = ref(false);
const isRevoking = ref<string | boolean>(false); // Use string ID for specific loading
const apiKeys = ref<ApiKey[]>([]);
const showKeyModal = ref(false);
const newlyGeneratedKey = ref<string | null>(null);
const showRevokeModal = ref(false);
const keyToRevoke = ref<ApiKey | null>(null);

// --- API LOGIC (MOCKED) ---
const fetchApiKeys = async () => {
  isLoading.value = true;
  try {
    // In a real app: const data = await apiFetch('/app/settings/api-keys');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Start with an empty array to show the initial state first
    // apiKeys.value = [
    //   { id: '1', maskedKey: 'sk_live_...a1b2', createdAt: '2025-10-01T10:00:00Z' },
    // ];
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleGenerateKey = async () => {
  isGenerating.value = true;
  try {
    // In a real app: const data = await apiFetch('/app/settings/api-keys', { method: 'POST' });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newKey = "sk_live_" + Math.random().toString(36).substr(2); // Mock key
    newlyGeneratedKey.value = newKey;
    showKeyModal.value = true;
  } catch (error) {
    console.error("Failed to generate API key:", error);
    alert("An error occurred while generating the key.");
  } finally {
    isGenerating.value = false;
  }
};

const closeKeyModal = () => {
  showKeyModal.value = false;
  newlyGeneratedKey.value = null;
  fetchApiKeys(); // Re-fetch the list to show the new masked key
};

const openRevokeModal = (key: ApiKey) => {
  keyToRevoke.value = key;
  showRevokeModal.value = true;
};

const handleRevokeKey = async () => {
  if (!keyToRevoke.value) return;
  isRevoking.value = keyToRevoke.value.id;
  try {
    // In a real app: await apiFetch(`/app/settings/api-keys/${keyToRevoke.value.id}`, { method: 'DELETE' });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`API Key ${keyToRevoke.value.maskedKey} has been revoked.`);
    showRevokeModal.value = false;
    keyToRevoke.value = null;
    fetchApiKeys(); // Re-fetch the list to remove the key from the UI
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    alert("An error occurred while revoking the key.");
  } finally {
    isRevoking.value = false;
  }
};

onMounted(() => {
  fetchApiKeys();
});

// --- HELPER FUNCTIONS ---
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
</script>

<style lang="scss" scoped>
.api-keys-card {
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
.loading-state,
.empty-state {
  @apply text-center py-12;
  .icon-wrapper {
    @apply size-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4;
  }
  .empty-title {
    @apply text-lg font-semibold text-grey-900;
  }
  .empty-description {
    @apply text-sm text-grey-600 mt-1;
  }
}
.keys-list-container {
  .list-header {
    @apply flex justify-between items-center mb-6;
    span {
      @apply font-semibold text-grey-800;
    }
  }
  .keys-list {
    @apply flex flex-col gap-y-3;
  }
  .key-item {
    @apply flex justify-between items-center p-4 border border-grey-200/90 rounded-lg;
    .key-details {
      @apply flex flex-col items-start;
    }
    .key-masked {
      @apply font-mono font-medium text-grey-900;
    }
    .key-date {
      @apply text-xs text-grey-500 mt-1;
    }
  }
}
</style>
