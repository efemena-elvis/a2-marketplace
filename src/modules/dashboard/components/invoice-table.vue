<template>
  <div class="invoice-table-container">
    <div class="header">
      <h2 class="title">Synced Invoices</h2>
      <button class="btn btn-secondary btn-sm" @click="$emit('sync-now')">
        <!-- You would use an SVG icon library for this in a real app -->
        <span>&#x21bb;</span>
        <!-- Unicode for a refresh icon -->
        Sync Now
      </button>
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
            <th>Status</th>
            <th>Actions</th>
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
        <p>
          We didn't find any invoices in your Zoho account for the current
          period.
        </p>
        <p>Try syncing again or create a new invoice in Zoho Books.</p>
      </div>

      <!-- STATE 3: Data Display -->
      <table v-else class="invoice-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td class="invoice-id">{{ invoice.number }}</td>
            <td>{{ invoice.customerName }}</td>
            <td>{{ formatDate(invoice.date) }}</td>
            <td>{{ formatCurrency(invoice.amount) }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(invoice.status)]">
                {{ invoice.status }}
              </span>
            </td>
            <td class="actions">
              <!-- A real implementation would use a dropdown component for the menu -->
              <button class="btn-icon" title="More options">
                <span>&#8942;</span>
                <!-- Vertical ellipsis -->
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define the shape of an invoice object for type safety
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string; // Assuming ISO date string e.g., "2023-10-27"
  amount: number;
  status: "Approved" | "Rejected" | "Pending Validation" | "Awaiting FIRS";
}

// Define component props
defineProps<{
  invoices: Invoice[];
  loading: boolean;
}>();

// Define component emits for actions
defineEmits(["sync-now"]);

// Helper function for status badge styling
const getStatusClass = (status: Invoice["status"]) => {
  switch (status) {
    case "Approved":
      return "status-approved";
    case "Rejected":
      return "status-rejected";
    case "Pending Validation":
      return "status-pending";
    case "Awaiting FIRS":
      return "status-awaiting";
    default:
      return "status-default";
  }
};

// Helper for formatting currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value);
};

// Helper for formatting dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<style lang="scss" scoped>
.invoice-table-container {
  @apply bg-neutral-10 p-6 sm:p-8 rounded-lg border border-grey-50;

  .header {
    @apply flex justify-between items-center mb-6;
    .title {
      @apply text-xl font-bold text-blue-900;
    }
  }

  .table-wrapper {
    @apply w-full overflow-x-auto;
  }

  .invoice-table {
    @apply w-full border-collapse text-left;

    th,
    td {
      @apply p-4 border-b border-grey-50;
    }

    thead {
      tr {
        th {
          @apply text-sm font-semibold text-grey-500 uppercase bg-blue-50/50;
        }
      }
    }

    tbody {
      tr {
        @apply transition-colors duration-200;
        &:hover {
          @apply bg-blue-10;
        }
      }
      td {
        @apply text-sm text-grey-800;
        &.invoice-id {
          @apply font-medium text-primary-800;
        }
      }
    }
  }

  .status-badge {
    @apply inline-block px-3 py-1 text-xs font-medium rounded-full;
    &.status-approved {
      @apply bg-green-100 text-green-900;
    }
    &.status-rejected {
      @apply bg-red-100 text-red-900;
    }
    &.status-pending {
      @apply bg-yellow-100 text-yellow-900;
    }
    &.status-awaiting {
      @apply bg-blue-100 text-blue-800;
    }
    &.status-default {
      @apply bg-grey-100 text-grey-900;
    }
  }

  .actions {
    @apply text-center;
    .btn-icon {
      @apply p-2 rounded-full h-8 w-8 flex items-center justify-center;
      &:hover {
        @apply bg-blue-100;
      }
    }
  }

  .empty-state {
    @apply text-center p-12 border-2 border-dashed border-grey-100 rounded-lg;
    h3 {
      @apply text-lg font-semibold text-blue-900 mb-2;
    }
    p {
      @apply text-sm text-grey-600;
    }
  }

  // Skeleton Loader Styles
  .skeleton-row {
    &:hover {
      @apply bg-transparent;
    } // Disable hover on skeleton
  }
  .skeleton-bar {
    @apply w-full h-4 bg-grey-100 rounded animate-pulse;
  }
}
</style>
