<template>
  <div class="invoice-table-container">
    <div class="header">
      <div class="header-text">
        <h2 class="title">Synced Invoices</h2>
        <p class="subtitle">
          Found {{ invoices.length }} invoices ready for review.
        </p>
      </div>

      <div class="header-actions">
        <button
          class="btn btn-secondary btn-sm"
          @click="$emit('sync-now')"
          :disabled="loading"
        >
          <span>&#x21bb;</span>
          Sync Now
        </button>

        <!-- <button
          v-if="isIRNGenerated"
          class="btn btn-primary btn-sm"
          @click="$emit('validate-invoices')"
          :disabled="!invoices.length || loading"
        >
          Validate Invoices
        </button>

        <button
          v-else
          class="btn btn-primary btn-sm"
          @click="$emit('generate-irn')"
          :disabled="!invoices.length || loading"
        >
          Generate IRN
        </button> -->
      </div>
    </div>

    <div class="table-wrapper">
      <!-- STATE 1: Loading Skeleton -->
      <table v-if="loading" class="invoice-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>IRN</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i" class="skeleton-row">
            <td><div class="skeleton-bar"></div></td>
            <td><div class="skeleton-bar"></div></td>
            <td><div class="skeleton-bar"></div></td>
            <td><div class="skeleton-bar"></div></td>
            <td><div class="skeleton-bar"></div></td>
            <td><div class="skeleton-bar"></div></td>
          </tr>
        </tbody>
      </table>

      <!-- STATE 2: Empty (After loading, no invoices found) -->
      <div v-else-if="!invoices.length" class="empty-state">
        <h3>No Invoices Found</h3>
        <p>We didn't find any pending invoices in your Zoho account.</p>
        <p>Try syncing again or create a new invoice in Zoho Books.</p>
      </div>

      <!-- STATE 3: Data Display -->
      <table v-else class="invoice-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <!-- <th>Customer</th> -->
            <th>Date</th>
            <th>Amount</th>
            <th>IRN</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invoice, index) in invoices" :key="invoice.id">
            <td class="invoice-id">{{ invoice.number }}</td>
            <!-- <td>{{ invoice.customerName }}</td> -->
            <td>{{ formatDate(invoice.date) }}</td>
            <td>{{ formatCurrency(invoice.amount, invoice.currency_code) }}</td>
            <td>{{ invoice.irn || "---" }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(invoice.status)]">{{
                invoice.status
              }}</span>
            </td>
            <td>
              <template v-if="!invoice.isSigned && !invoice.isValidated">
                <button
                  v-if="invoice.irn"
                  class="btn btn-primary btn-sm"
                  @click="$emit('validate-invoices', index)"
                  :disabled="!invoices.length || loading"
                >
                  Validate Invoices
                </button>

                <button
                  v-else
                  class="btn btn-primary btn-sm"
                  @click="$emit('generate-irn', index)"
                  :disabled="!invoices.length || loading"
                >
                  Generate IRN
                </button>
              </template>

              <template v-else-if="invoice.isSigned && invoice.isValidated">
                <button class="btn btn-primary btn-sm" disabled>
                  Submitted
                </button>
              </template>

              <template v-else>
                <button
                  class="btn btn-primary btn-sm"
                  @click="$emit('sign-invoices', index)"
                  :disabled="!invoices.length || loading"
                >
                  Submit
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  irn?: string;
  currency_code: string;
  isValidated?: boolean;
  isSigned?: boolean;
  status:
    | "Approved"
    | "Rejected"
    | "Pending Validation"
    | "Pending IRN"
    | "Pending Signing"
    | "Awaiting FIRS";
}

const props = defineProps<{ invoices: Invoice[]; loading: boolean }>();
defineEmits(["sync-now", "validate-invoices", "sign-invoices", "generate-irn"]);

const isIRNGenerated = computed(() => {
  return props.invoices.some((invoice) => invoice.irn);
});

const getStatusClass = (status: Invoice["status"]) => {
  const statusMap = {
    Approved: "status-approved",
    Rejected: "status-rejected",
    "Pending Validation": "status-pending",
    "Pending IRN": "status-irn",
    "Pending Signing": "status-signing",
    "Awaiting FIRS": "status-awaiting",
  };
  return statusMap[status] || "status-default";
};
const formatCurrency = (value: number, currency_code: string = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value);
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
</script>

<style lang="scss" scoped>
/* NOTE: Using your full styles as a base */
.invoice-table-container {
  @apply bg-neutral-10 p-6 sm:p-8 rounded-lg border border-grey-50;
}
.header {
  @apply flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4;
}
.header-text .title {
  @apply text-xl font-bold text-blue-900;
}
.header-text .subtitle {
  @apply text-sm text-grey-600 mt-1;
}
.header-actions {
  @apply flex items-center gap-x-3;
}
.table-wrapper {
  @apply w-full overflow-x-auto;
}
.invoice-table {
  @apply w-full border-collapse text-left;
}
th,
td {
  @apply p-4 border-b border-grey-50 whitespace-nowrap;
}
thead tr th {
  @apply text-sm font-semibold text-grey-500 uppercase bg-blue-50/50;
}
tbody tr {
  @apply transition-colors duration-200;
  &:hover {
    @apply bg-blue-10;
  }
}
td {
  @apply text-sm text-grey-800;
}
td.invoice-id {
  @apply font-medium text-primary-800;
}
.status-badge {
  @apply inline-block px-3 py-1 text-xs font-medium rounded-full;
}
.status-approved {
  @apply bg-green-100 text-green-900;
}
.status-rejected {
  @apply bg-red-100 text-red-900;
}
.status-pending,
.status-irn,
.status-signing {
  @apply bg-yellow-100 text-yellow-900;
}
.status-awaiting {
  @apply bg-blue-100 text-blue-800;
}
.actions {
  @apply text-center;
}
.btn-icon {
  @apply p-2 rounded-full h-8 w-8 flex items-center justify-center;
  &:hover {
    @apply bg-blue-100;
  }
}
.empty-state {
  @apply text-center p-12 border-2 border-dashed border-grey-100 rounded-lg;
}
.empty-state h3 {
  @apply text-lg font-semibold text-blue-900 mb-2;
}
.empty-state p {
  @apply text-sm text-grey-600;
}
.skeleton-row:hover {
  @apply bg-transparent;
}
.skeleton-bar {
  @apply w-full h-4 bg-grey-100 rounded animate-pulse;
}
</style>
