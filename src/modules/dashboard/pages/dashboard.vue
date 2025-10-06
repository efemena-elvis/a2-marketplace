<template>
  <div>
    <!-- STATE 1: Loading. Shown while we verify the user's connection status on initial page load. -->
    <div v-if="isLoading" class="loading-container">
      <p>Verifying connection status...</p>
    </div>

    <!-- STATE 2: Not Connected. Show the empty state prompt for the user to connect to Zoho. -->
    <DashboardEmptyState v-else-if="!isZohoConnected" />

    <!-- STATE 3: Connected. Show the main invoice dashboard table. -->
    <div v-else class="invoice-dashboard">
      <InvoiceTable
        :invoices="syncedInvoices"
        :loading="isFetchingInvoices"
        @sync-now="handleManualSync"
        @validate-invoices="handleValidation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import DashboardEmptyState from "@/modules/dashboard/components/dashboard-empty.vue";
import InvoiceTable from "@/modules/dashboard/components/invoice-table.vue";

// --- INTERFACES AND CONSTANTS ---

// Defines the structure of an invoice object used within the component
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  status: "Approved" | "Rejected" | "Pending Validation" | "Awaiting FIRS";
}

// Access the current route to check for query parameters from the Zoho redirect
const route = useRoute();

// --- CONFIGURATION ---
const xAPIkey = "xkOJymWuJJ7AaStmDsjypXPe8KXWQY73RQBbJ1Y9";
const apiBaseURL = "https://staging-api.a2comply.com/invoices/v1";

// Constants for localStorage keys to ensure consistency
const ZOHO_ACCESS_TOKEN_KEY = "ZOHO_ACCESS_TOKEN";
const ZOHO_REFRESH_TOKEN_KEY = "ZOHO_REFRESH_TOKEN";

// --- REACTIVE UI STATE ---

// Controls the initial "Verifying..." loading screen
const isLoading = ref<boolean>(true);
// The primary state that determines if we show the "Connect" screen or the invoice table
const isZohoConnected = ref<boolean>(false);
// Controls the skeleton loader inside the InvoiceTable component
const isFetchingInvoices = ref<boolean>(false);
// The array that holds the invoice data fetched from the API
const syncedInvoices = ref<Invoice[]>([]);

// --- CORE API AND TOKEN REFRESH LOGIC ---

/**
 * Performs the token refresh by calling your backend's refresh endpoint.
 * It expects both a new access token and a new refresh token in the response.
 * @returns {Promise<boolean>} - True if the refresh was successful, false otherwise.
 */
const handleTokenRefresh = async (): Promise<boolean> => {
  console.log("Access token expired or invalid. Attempting to refresh...");
  const refreshToken = localStorage.getItem(ZOHO_REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    console.error("Token Refresh Failed: No refresh token found.");
    isZohoConnected.value = false;
    return false;
  }

  const refreshUrl = `${apiBaseURL}/imports/zoho/auth/refresh`;
  const headers = new Headers({
    "x-api-key": xAPIkey,
    "Content-Type": "application/json",
  });

  try {
    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || "Token refresh API call failed.");
    }

    const { access_token: accessToken, refresh_token: newRefreshToken } = data;
    if (!accessToken || !newRefreshToken) {
      throw new Error(
        "Refresh endpoint did not return the expected new tokens."
      );
    }

    // Update localStorage with BOTH new tokens
    localStorage.setItem(ZOHO_ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(ZOHO_REFRESH_TOKEN_KEY, newRefreshToken);
    console.log("Successfully refreshed both access and refresh tokens.");
    return true; // Success!
  } catch (error) {
    console.error("A critical error occurred during token refresh:", error);
    // If refresh fails, the session is invalid. Clear all tokens and mark as disconnected.
    localStorage.removeItem(ZOHO_ACCESS_TOKEN_KEY);
    localStorage.removeItem(ZOHO_REFRESH_TOKEN_KEY);
    isZohoConnected.value = false;
    return false; // Failure
  }
};

/**
 * A reusable, intelligent fetch wrapper for your API.
 * It automatically adds headers and handles the 401 token refresh/retry flow.
 * @param endpoint - The API endpoint to call (e.g., '/imports/zoho/invoices').
 * @param options - Standard fetch options (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the API.
 */
const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  let accessToken = localStorage.getItem(ZOHO_ACCESS_TOKEN_KEY);
  if (!accessToken) {
    throw new Error("No access token available for API request.");
  }

  const url = `${apiBaseURL}${endpoint}`;
  const headers = new Headers(options.headers || {});
  headers.set("zoho_authorization", accessToken);
  headers.set("x-api-key", xAPIkey);

  const requestOptions: RequestInit = { ...options, headers };

  // First Attempt
  let response = await fetch(url, requestOptions);

  // If the first attempt fails with 401 Unauthorized, try to refresh and retry
  if (response.status === 401) {
    const refreshSuccessful = await handleTokenRefresh();

    if (refreshSuccessful) {
      // Get the NEW token from storage and update the headers for the retry
      accessToken = localStorage.getItem(ZOHO_ACCESS_TOKEN_KEY);
      headers.set("zoho_authorization", accessToken!);

      console.log("Retrying the failed API request with the new token...");
      response = await fetch(url, requestOptions); // Second Attempt
    } else {
      // If refresh fails, we can't proceed.
      throw new Error("Token refresh failed. The user is now disconnected.");
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches the list of invoices using the intelligent apiFetch wrapper.
 */
const fetchInvoices = async (): Promise<void> => {
  isFetchingInvoices.value = true;
  try {
    const data = await apiFetch("/imports/zoho/invoices", { method: "GET" });
    syncedInvoices.value = (data?.invoices || []).map((inv: any) => ({
      id: inv.invoice_id || `id_${Math.random()}`,
      number: inv.invoice_number || "N/A",
      customerName: inv.customer_name || "Unknown Customer",
      date: inv.date || new Date().toISOString(),
      amount: inv.total || 0,
      status: "Pending Validation",
    }));
  } catch (error) {
    console.error("An error occurred while fetching invoices:", error);
    syncedInvoices.value = []; // Clear invoices on error to prevent displaying stale data.
  } finally {
    isFetchingInvoices.value = false;
  }
};

/**
 * Initializes the component's state on page load.
 */
const initializeConnection = async (): Promise<void> => {
  const { access_token, refresh_token } = route.query;
  if (access_token && refresh_token) {
    localStorage.setItem(ZOHO_ACCESS_TOKEN_KEY, access_token as string);
    localStorage.setItem(ZOHO_REFRESH_TOKEN_KEY, refresh_token as string);
    isZohoConnected.value = true;
    window.history.replaceState({}, document.title, window.location.pathname);
    await fetchInvoices();
  } else if (localStorage.getItem(ZOHO_ACCESS_TOKEN_KEY)) {
    isZohoConnected.value = true;
    await fetchInvoices();
  } else {
    isZohoConnected.value = false;
  }
  isLoading.value = false;
};

// --- EVENT HANDLERS ---
const handleManualSync = (): void => {
  console.log("Manual sync triggered by user.");
  fetchInvoices();
};

const handleValidation = (): void => {
  if (!syncedInvoices.value.length) {
    alert("There are no invoices to validate.");
    return;
  }
  const invoiceNumbers = syncedInvoices.value
    .map((inv) => inv.number)
    .join(", ");
  alert(`Initiating validation for the following invoices: ${invoiceNumbers}`);
  // In a real app, this would call apiFetch('/invoices/validate', { method: 'POST', body: ... })
};

// --- VUE LIFECYCLE HOOK ---
onMounted(() => {
  initializeConnection();
});
</script>

<style lang="scss" scoped>
.loading-container {
  @apply flex flex-col items-center justify-center text-center p-10 min-h-[400px];
}

.invoice-dashboard {
  @apply p-4 sm:p-6 md:p-8;
}
</style>
