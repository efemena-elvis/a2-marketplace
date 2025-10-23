<template>
  <div class="providers-page">
    <!-- MAIN CARD -->
    <div class="providers-card">
      <div class="card-header">
        <h2 class="card-title">Service Providers</h2>
        <p class="card-description">
          Connect your accounting software to automatically sync your invoices.
        </p>
      </div>

      <div class="card-body">
        <!-- API KEY GATE -->
        <div v-if="!hasApiKey" class="api-key-gate">
          <div class="icon-wrapper">
            <div class="icon icon-shield-slash"></div>
          </div>
          <h3 class="gate-title">API Key Required</h3>
          <p class="gate-description">
            Please generate an API Key in the 'API Keys' section before you can
            connect a service provider.
          </p>
          <router-link
            to="/settings/api-keys"
            class="btn btn-primary btn-md mt-4"
          >
            Go to API Keys
          </router-link>
        </div>

        <!-- PROVIDERS LIST -->
        <div v-else class="providers-list">
          <!-- ZOHO PROVIDER -->
          <div class="provider-item">
            <div class="provider-info">
              <img
                src="@/shared/assets/images/zoho.png"
                alt="Zoho Logo"
                class="provider-logo"
              />
              <div class="provider-details">
                <span class="provider-name">Zoho Books</span>
                <span
                  v-if="!zohoConnection.isConnected"
                  class="provider-status-disconnected"
                  >Not Connected</span
                >
                <span v-else class="provider-status-connected">Connected</span>
              </div>
            </div>
            <div class="provider-actions">
              <button
                v-if="!zohoConnection.isConnected"
                class="btn btn-primary btn-sm"
                @click="handleConnectZoho"
              >
                Connect
              </button>
              <!-- @click="openConnectModal" -->

              <button
                v-else
                class="btn btn-alert btn-sm"
                @click="openDisconnectModal"
              >
                Disconnect
              </button>
            </div>
          </div>
          <!-- Add other providers here in the future (e.g., QuickBooks, Sage) -->
        </div>
      </div>
    </div>

    <!-- MODAL 1: CONNECT ZOHO -->
    <ModalDialog
      v-if="showConnectModal"
      @close-modal="showConnectModal = false"
      size="modal-xs"
    >
      <template #modal-cover-header>
        <div class="modal-cover-header">
          <h3 class="modal-cover-title">Connect to Zoho Books</h3>
          <p class="modal-cover-meta">
            Enter your Zoho application credentials to connect your account.
            <a href="#" class="link">Need help finding these?</a>
          </p>
        </div>
      </template>

      <template #modal-cover-body>
        <div class="modal-cover-body">
          <form @submit.prevent="handleConnectZoho">
            <TextFieldInput
              label-title="Organization ID"
              v-model:input-value="zohoCredentials.orgId"
            />
          </form>
        </div>
      </template>

      <template #modal-cover-footer>
        <div class="modal-cover-footer flex justify-end gap-x-3">
          <button
            class="btn btn-secondary btn-md"
            @click="showConnectModal = false"
          >
            Cancel
          </button>

          <button
            class="btn btn-primary btn-md"
            @click="handleConnectZoho"
            :disabled="isConnecting"
          >
            <div
              v-if="isConnecting"
              class="icon icon-spinner-ios animate-spin"
            ></div>
            <span v-else>Connect Account</span>
          </button>
        </div>
      </template>
    </ModalDialog>

    <!-- MODAL 2: DISCONNECT CONFIRMATION -->
    <ModalDialog
      v-if="showDisconnectModal"
      @close-modal="showDisconnectModal = false"
      size="modal-sm"
    >
      <template #modal-cover-header>
        <div class="modal-cover-header">
          <h3 class="modal-cover-title">Disconnect Zoho Books?</h3>
          <p class="modal-cover-meta">
            Are you sure? This will stop all automatic invoice syncing from your
            Zoho account.
          </p>
        </div>
      </template>
      <template #modal-cover-footer>
        <div class="modal-cover-footer flex justify-end gap-x-3">
          <button
            class="btn btn-secondary btn-md"
            @click="showDisconnectModal = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-alert btn-md"
            @click="handleDisconnectZoho"
            :disabled="isConnecting"
          >
            <div
              v-if="isConnecting"
              class="icon icon-spinner-ios animate-spin"
            ></div>
            <span v-else>Yes, Disconnect</span>
          </button>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ModalDialog from "@/shared/components/global-comps/modal-dialog.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import constants from "@/utilities/constants";

// --- REACTIVE STATE ---
const hasApiKey = ref(true); // This will determine if the "Connect" button is enabled
const isConnecting = ref(false);
const showConnectModal = ref(false);
const showDisconnectModal = ref(false);

const zohoConnection = ref({
  isConnected: false,
});

const zohoCredentials = ref({
  orgId: "",
});

// --- API LOGIC (MOCKED) ---
// This function checks if any API keys exist to enable the UI
const checkApiKeyStatus = async () => {
  try {
    // In a real app: const data = await apiFetch('/app/settings/api-keys');
    // hasApiKey.value = data.keys.length > 0;
    // For demo, we'll assume a key exists after a short delay

    await new Promise((resolve) => setTimeout(resolve, 500));
    hasApiKey.value = true;
  } catch (error) {
    console.error("Failed to check API key status:", error);
    hasApiKey.value = false;
  }
};

// This function checks the connection status of providers
const fetchProviderStatus = async () => {
  try {
    // In a real app: const data = await apiFetch('/app/settings/providers');
    // zohoConnection.value.isConnected = data.zoho.isConnected;

    const zohoApiKey = localStorage.getItem("ZOHO_API_KEY");

    if (zohoApiKey) {
      zohoConnection.value.isConnected = true;
    }
  } catch (error) {
    console.error("Failed to fetch provider status:", error);
  }
};

const openConnectModal = () => {
  zohoCredentials.value = { orgId: "" };
  showConnectModal.value = true;
};

const handleConnectZoho = async () => {
  isConnecting.value = true;

  try {
    const { ZOHO_CLIENT_ID, ZOHO_SCOPES, ZOHO_REDIRECT_URI_PATH } = constants;

    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${ZOHO_SCOPES}&client_id=${ZOHO_CLIENT_ID}&response_type=code&redirect_uri=${ZOHO_REDIRECT_URI_PATH}&access_type=offline`;

    // Redirect the user's browser to the Zoho authentication page
    window.location.href = authUrl;
  } catch (error) {
    console.error("Failed to connect Zoho:", error);
    alert("An error occurred. Please check your credentials and try again.");
  } finally {
    isConnecting.value = false;
  }
};

const openDisconnectModal = () => {
  showDisconnectModal.value = true;
};

const handleDisconnectZoho = async () => {
  isConnecting.value = true;

  try {
    // In a real app: await apiFetch('/app/settings/providers/zoho', { method: 'DELETE' });
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.removeItem("ZOHO_API_KEY");

    zohoConnection.value.isConnected = false;
    showDisconnectModal.value = false;
    alert("Successfully disconnected from Zoho Books.");
  } catch (error) {
    console.error("Failed to disconnect Zoho:", error);
    alert("An error occurred while disconnecting.");
  } finally {
    isConnecting.value = false;
  }
};

onMounted(() => {
  // checkApiKeyStatus();
  fetchProviderStatus();
});
</script>

<style lang="scss" scoped>
.providers-card {
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

.api-key-gate {
  @apply text-center py-12;
  .icon-wrapper {
    @apply size-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4;
  }
  .icon {
    @apply text-red-500 text-4xl;
  }
  .gate-title {
    @apply text-lg font-semibold text-grey-900;
  }
  .gate-description {
    @apply text-sm text-grey-600 mt-1 max-w-sm mx-auto;
  }
}

.providers-list {
  @apply flex flex-col gap-y-4;
}

.provider-item {
  @apply flex justify-between items-center p-4 border border-grey-200/90 rounded-lg;
}

.provider-info {
  @apply flex items-center gap-x-4;
  .provider-logo {
    @apply h-10 w-auto;
  }
  .provider-details {
    @apply flex flex-col items-start;
  }
  .provider-name {
    @apply font-semibold text-grey-900;
  }
  .provider-status-disconnected {
    @apply text-xs text-grey-500;
  }
  .provider-status-connected {
    @apply text-xs text-green-700 font-medium px-2 py-0.5 bg-green-100 rounded-full;
  }
}
</style>
