<template>
  <div>
    <!-- STATE 1: Loading. Shown while we verify the user's connection status. -->
    <div v-if="isLoading" class="loading-container">
      <p>Verifying connection status...</p>
    </div>

    <!-- STATE 2: Error. Shown if the API fails or the redirect has an error. -->
    <!-- <div v-else-if="errorMessage" class="error-container">
      <h2>Connection Failed</h2>
      <p>{{ errorMessage }}</p>
      <button @click="resetAndRetry" class="btn btn-secondary btn-sm">
        Try Again
      </button>
    </div> -->

    <!-- STATE 3: Not Connected. Show the empty state prompt. -->
    <DashboardEmptyState v-else-if="!isZohoConnected" />

    <!-- STATE 4: Connected. Show the main invoice dashboard. -->
    <div v-else class="invoice-dashboard">
      <InvoiceTable
        :invoices="syncedInvoices"
        :loading="isFetchingInvoices"
        @sync-now="handleManualSync"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import DashboardEmptyState from "@/modules/dashboard/components/dashboard-empty.vue";
import InvoiceTable from "@/modules/dashboard/components/invoice-table.vue";

// Define the Invoice type again or import it from a shared types file
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  status: "Approved" | "Rejected" | "Pending Validation" | "Awaiting FIRS";
}

const isLoading = ref(true);
const isZohoConnected = ref(false);
const errorMessage = ref<string | null>(null);

// New reactive variables for the invoice data
const syncedInvoices = ref<Invoice[]>([]);
const isFetchingInvoices = ref(false);

// Function to fetch invoices from your backend
const fetchInvoices = async () => {
  isFetchingInvoices.value = true;
  try {
    // This is where you call YOUR backend, which then calls Zoho
    const response = await fetch("/api/invoices/fetch");
    if (!response.ok) throw new Error("Failed to fetch invoices.");
    const data = await response.json();
    syncedInvoices.value = data.invoices; // Assuming API returns { invoices: [...] }
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    // You could set an error message to display to the user
  } finally {
    isFetchingInvoices.value = false;
  }
};

// Handler for the "Sync Now" button click
const handleManualSync = () => {
  console.log("Manual sync triggered!");
  fetchInvoices();
};

const checkConnectionStatus = async () => {
  try {
    const response = await fetch("/api/user/connection-status");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    isZohoConnected.value = data.isConnected;
    fetchInvoices();
  } catch (error) {
    console.error("API Error: Could not verify Zoho connection status.", error);
    errorMessage.value =
      "We couldn't verify your connection status due to a server error. Please try again later.";
    isZohoConnected.value = false;
  } finally {
    isLoading.value = false;
  }
};

const resetAndRetry = () => {
  errorMessage.value = null;
  isLoading.value = true;
  checkConnectionStatus();
};

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);

  // SCENARIO A: User is returning from a SUCCESSFUL Zoho redirect
  if (queryParams.has("status") && queryParams.get("status") === "connected") {
    // This is an optimistic update. We assume success and show the dashboard immediately.
    isZohoConnected.value = true;
    isLoading.value = false;
    // You should show a success toast/notification here instead of an alert
    alert("Successfully connected to Zoho!");
    // Clean the URL to prevent the message from showing on refresh
    window.history.replaceState({}, document.title, window.location.pathname);
    fetchInvoices();
    return; // Stop further execution
  }

  // SCENARIO B: User is returning from a FAILED Zoho redirect
  if (queryParams.has("error")) {
    const errorDescription =
      queryParams.get("error_description") ||
      "The connection was denied or failed at Zoho. Please try again.";
    errorMessage.value = `Error from Zoho: ${errorDescription}`;
    isLoading.value = false;
    window.history.replaceState({}, document.title, window.location.pathname);
    return; // Stop further execution
  }

  // SCENARIO C: Normal page load, not a redirect. Check status from our server.
  checkConnectionStatus();
});
</script>

<style lang="scss" scoped>
.loading-container,
.error-container {
  @apply flex flex-col items-center justify-center text-center p-10 min-h-[400px];
}
.error-container {
  h2 {
    @apply text-2xl font-bold text-red-800 mb-2;
  }
  p {
    @apply text-grey-700 mb-6;
  }
}
// .invoice-dashboard {
//   @apply p-8;
//   h1 {
//     @apply text-3xl font-bold text-blue-900 mb-4;
//   }
//   p {
//     @apply text-grey-800;
//   }
// }

.invoice-dashboard {
  @apply p-4 sm:p-6 md:p-8;
}
</style>
