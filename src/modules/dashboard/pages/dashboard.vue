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
        :loading="
          isFetchingInvoices || isGeneratingIRN || isSubmittingForValidation
        "
        @sync-now="handleManualSync"
        @generate-irn="handleGenerateIRN"
        @validate-invoices="handleValidation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios, { AxiosRequestConfig } from "axios";
import DashboardEmptyState from "@/modules/dashboard/components/dashboard-empty.vue";
import InvoiceTable from "@/modules/dashboard/components/invoice-table.vue";

// --- INTERFACES AND CONSTANTS ---
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  irn?: string;
  currency_code: string;
  status:
    | "Approved"
    | "Rejected"
    | "Pending Validation"
    | "Pending IRN"
    | "Awaiting FIRS";
}

const route = useRoute();

// --- CONFIGURATION ---
const xAPIkey = "xkOJymWuJJ7AaStmDsjypXPe8KXWQY73RQBbJ1Y9";
// THIS MUST POINT TO YOUR LOCAL PROXY TO BYPASS CORS DURING DEVELOPMENT
const apiBaseURL = "https://staging-api.a2comply.com/invoices/v1";

const ZOHO_ACCESS_TOKEN_KEY = "ZOHO_ACCESS_TOKEN";
const ZOHO_REFRESH_TOKEN_KEY = "ZOHO_REFRESH_TOKEN";

// --- REACTIVE UI STATE ---
const isLoading = ref<boolean>(true);
const isZohoConnected = ref<boolean>(false);
const isFetchingInvoices = ref<boolean>(false);
const syncedInvoices = ref<Invoice[]>([]);

const isGeneratingIRN = ref<boolean>(false);
const generatedIRNInvoice = ref<any[]>([]);

const isSubmittingForValidation = ref<boolean>(false);

// --- CORE API AND TOKEN REFRESH LOGIC ---

/**
 * Performs token refresh using axios.
 * @returns {Promise<boolean>} - True if refresh was successful.
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
  try {
    const response = await axios.post(
      refreshUrl,
      { refresh_token: refreshToken },
      { headers: { "x-api-key": xAPIkey } }
    );

    const { access_token: accessToken } = response.data;

    if (!accessToken) {
      throw new Error(
        "Refresh endpoint did not return the expected new tokens."
      );
    }

    localStorage.setItem(ZOHO_ACCESS_TOKEN_KEY, accessToken);
    console.log("Successfully refreshed both access and refresh tokens.");
    return true;
  } catch (error) {
    console.error("A critical error occurred during token refresh:", error);
    localStorage.removeItem(ZOHO_ACCESS_TOKEN_KEY);
    localStorage.removeItem(ZOHO_REFRESH_TOKEN_KEY);
    isZohoConnected.value = false;
    return false;
  }
};

/**
 * Reusable axios wrapper that handles auth headers and the 401 retry flow.
 * @param endpoint - The API endpoint to call (e.g., '/imports/zoho/invoices').
 * @param options - Axios request configuration.
 * @returns {Promise<any>} - The data from the API response.
 */
const apiFetch = async (
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<any> => {
  let accessToken = localStorage.getItem(ZOHO_ACCESS_TOKEN_KEY);
  if (!accessToken)
    throw new Error("No access token available for API request.");

  const url = `${apiBaseURL}${endpoint}`;

  // Set default headers and merge with any provided in options
  const headers = {
    ...options.headers,
    zoho_authorization: accessToken,
    "x-api-key": xAPIkey,
  };

  const config: AxiosRequestConfig = { ...options, headers };

  try {
    // First Attempt
    const response = await axios(url, config);

    return response.data;
  } catch (error) {
    // Axios throws an error for non-2xx responses. We check if it's a 401.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const refreshSuccessful = await handleTokenRefresh();

      if (refreshSuccessful) {
        // Get the NEW token and update the header for the retry
        config.headers!["zoho_authorization"] = localStorage.getItem(
          ZOHO_ACCESS_TOKEN_KEY
        );
        console.log("Retrying the failed API request with the new token...");
        const retryResponse = await axios(url, config); // Second Attempt
        return retryResponse.data;
      } else {
        throw new Error("Token refresh failed. The user is now disconnected.");
      }
    }
    // If it's not a 401 or some other error, re-throw it to be caught by the calling function.
    throw error;
  }
};

/**
 * Fetches the list of invoices using the intelligent apiFetch wrapper.
 */
const fetchInvoices = async (): Promise<void> => {
  isFetchingInvoices.value = true;
  try {
    const data = await apiFetch(`/imports/zoho/invoices`, { method: "GET" });

    syncedInvoices.value = (data?.invoices || []).map((inv: any) => ({
      id: inv.invoice_id || `id_${Math.random()}`,
      number: inv.invoice_number || "N/A",
      customerName: inv.customer_name || "Unknown Customer",
      date: inv.date || new Date().toISOString(),
      amount: inv.total || 0,
      currency_code: inv.currency_code || "N/A",
      status: "Pending IRN",
    }));
  } catch (error) {
    console.error("An error occurred while fetching invoices:", error);
    syncedInvoices.value = [];
  } finally {
    isFetchingInvoices.value = false;
  }
};

/**
 * Initializes the component's state on page load.
 */
const initializeConnection = async (): Promise<void> => {
  const { access_token, refresh_token } = route.query;

  if (access_token) {
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

/**
 * NEW: Generates IRN for all synced invoices by sending them to the validation endpoint.
 */
const handleGenerateIRN = async (): Promise<void> => {
  if (!syncedInvoices.value.length) {
    alert("There are no invoices to process.");
    return;
  }

  isGeneratingIRN.value = true;

  try {
    // Create an array of promises, one for each API call
    const promises = syncedInvoices.value.map((invoice) => {
      // Define the request body for each invoice
      const payload = {
        business_id: "BIZ12658941251",
        supplier: {
          name: "Your Business Name",
          tin: "123456789",
          email: "supplier@example.com",
          phone: "08012345678",
          address: {
            name: "123 Supplier Street",
            city: "Lagos",
            postal_code: "100001",
            country: "NG",
          },
        },
        customer: {
          name: invoice.customerName,
          tin: "987654321",
          email: "customer@example.com",
          phone: "09012345678",
        },
      };

      // Return the promise from apiFetch
      return apiFetch(`/imports/zoho/invoices/${invoice.id}`, {
        method: "POST",
        data: payload,
      });
    });

    // Wait for ALL the promises to resolve
    const results = await Promise.all(promises);

    const updatedInvoices = syncedInvoices.value.map(
      (originalInvoice, index) => {
        const irnResponse = results[index];

        return {
          ...originalInvoice,
          irn: irnResponse.irn,
          status: "Pending Validation",
          amount: irnResponse.legal_monetary_total.payable_amount,
          currency_code: irnResponse.document_currency_code,
          date: irnResponse.issue_date,
        } as Invoice;
      }
    );

    generatedIRNInvoice.value = results;

    // Replace the old array with the newly merged one to trigger UI update
    syncedInvoices.value = updatedInvoices;
  } catch (error) {
    console.error(
      "An error occurred while generating IRN for one or more invoices:",
      error
    );
    alert(
      "An error occurred during validation. Please check the console for details."
    );
  } finally {
    isGeneratingIRN.value = false;
  }
};

const handleValidation = async (): Promise<void> => {
  if (!generatedIRNInvoice.value.length) {
    alert("There are no invoices to validate.");
    return;
  }

  isSubmittingForValidation.value = true;

  try {
    // Create an array of promises, one for each API call
    const promises = generatedIRNInvoice.value.map((invoice) => {
      return apiFetch(`/validate/invoice`, {
        method: "POST",
        data: invoice,
      });
    });

    // Wait for ALL the promises to resolve
    await Promise.all(promises);

    const updatedInvoices = syncedInvoices.value.map((originalInvoice) => {
      return {
        ...originalInvoice,
        status: "Awaiting FIRS",
      } as Invoice;
    });

    // Replace the old array with the newly merged one to trigger UI update
    syncedInvoices.value = updatedInvoices;
  } catch (error) {
    console.error(
      "An error occurred while validating invoice for one or more invoices:",
      error
    );
    alert(
      "An error occurred during validation. Please check the console for details."
    );
  } finally {
    isSubmittingForValidation.value = false;
  }
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
