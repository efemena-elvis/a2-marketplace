<template>
  <div class="invoice-tracker-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Invoice Tracker</h1>
        <p class="page-description">
          Track the real-time status of all invoices submitted to FIRS for final
          validation.
        </p>
      </div>
    </div>

    <!-- TABLE SECTION -->
    <div class="table-section">
      <!-- TABS -->
      <div class="tabs-container">
        <button
          @click="setActiveTab('pending')"
          :class="['tab-item', { 'tab-item--active': activeTab === 'pending' }]"
        >
          Pending ({{ paginationData.pending.total_records }})
        </button>
        <button
          @click="setActiveTab('approved')"
          :class="[
            'tab-item',
            { 'tab-item--active': activeTab === 'approved' },
          ]"
        >
          Approved ({{ paginationData.approved.total_records }})
        </button>
        <button
          @click="setActiveTab('rejected')"
          :class="[
            'tab-item',
            { 'tab-item--active': activeTab === 'rejected' },
          ]"
        >
          Rejected ({{ paginationData.rejected.total_records }})
        </button>
      </div>

      <!-- FILTER BAR -->
      <div class="filter-bar">
        <TextFieldInput
          input-type="search"
          input-placeholder="Search by Invoice #, Customer, or IRN"
          class="search-input"
          :has-bottom-padding="false"
        />
        <div class="filter-actions">
          <SelectFieldInput
            input-placeholder="Filter by Date"
            class="date-filter"
            :has-bottom-padding="false"
          />
        </div>
      </div>

      <!-- TABLE CONTAINER -->
      <TableContainer
        :table-header="currentTableHeader"
        :table-body="invoicesForTable"
        :is-loading="isFetchingInvoices"
        :empty-data="emptyDataConfig"
      >
        <TableContainerBody
          v-for="(invoice, index) in invoicesForTable"
          :key="index"
          :table-header="currentTableHeader"
          :table-data="invoice"
          class="!cursor-default"
        />
      </TableContainer>

      <!-- PAGINATION -->
      <div
        v-if="!isFetchingInvoices && currentPaginationData.total_records > 0"
        class="pagination-container"
      >
        <Pagination
          :page-description="paginationDescription"
          :paging-data="currentPaginationData"
          :page-keys="pageKeys"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useString } from "@/shared/composables/useString";
import dateUtil from "@/shared/composables/useDate";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

// --- INTERFACES AND TYPES ---
type InvoiceStatus = "Awaiting FIRS" | "Approved" | "Rejected";
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  irn: string;
  submissionDate: string;
  amount: number;
  currency_code: string;
  status: InvoiceStatus;
  rejectionReason?: string;
}
interface IPaging {
  current_page: number;
  page_count: number;
  total_pages_count: number;
  total_records: number;
}

// --- COMPOSABLES ---
const { getBoldTableText, getStatus } = useString();

// --- REACTIVE STATE ---
const isFetchingInvoices = ref(true);
const activeTab = ref<"pending" | "approved" | "rejected">("pending");
const rawInvoices = ref<Invoice[]>([]);

// --- PAGINATION STATE ---
const paginationData = ref({
  pending: {
    current_page: 1,
    page_count: 0,
    total_pages_count: 1,
    total_records: 0,
  },
  approved: {
    current_page: 1,
    page_count: 0,
    total_pages_count: 1,
    total_records: 0,
  },
  rejected: {
    current_page: 1,
    page_count: 0,
    total_pages_count: 1,
    total_records: 0,
  },
});
const currentPaginationData = computed(
  () => paginationData.value[activeTab.value]
);
const paginationDescription = computed(() => {
  const data = currentPaginationData.value;
  if (!data.total_records) return "";
  const start = (data.current_page - 1) * data.page_count + 1;
  const end = Math.min(data.current_page * data.page_count, data.total_records);
  return `Showing ${start}-${end} of ${data.total_records} invoices`;
});
const pageKeys = ref({ green: "Approved", yellow: "Pending", red: "Rejected" });

// --- TABLE CONFIGURATION ---
const baseTableHeader = [
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "irn", title: "IRN" },
  { slug: "submissionDate", title: "Submission Date" },
  { slug: "status", title: "Status" },
];
const currentTableHeader = computed(() => {
  if (activeTab.value === "rejected") {
    // Insert the Rejection Reason column for the 'rejected' tab
    const headers = [...baseTableHeader];
    headers.splice(4, 0, {
      slug: "rejectionReason",
      title: "Rejection Reason",
    });
    return headers;
  }
  return baseTableHeader;
});
const emptyDataConfig = computed(() => ({
  title: `No ${activeTab.value} Invoices`,
  description: `Invoices with the status "${activeTab.value}" will appear here.`,
}));

// --- COMPUTED PROPERTIES ---
const invoicesForTable = computed(() => {
  return rawInvoices.value.map((invoice) => ({
    id: invoice.id,
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    irn: invoice.irn,
    submissionDate: formatDate(invoice.submissionDate),
    status: getStatus(
      invoice.status === "Approved"
        ? "success"
        : invoice.status === "Rejected"
          ? "failed"
          : "pending",
      invoice.status
    ),
    rejectionReason: `<span class="text-red-600">${invoice.rejectionReason || ""}</span>`,
  }));
});

// --- API LOGIC ---
const setActiveTab = (tab: "pending" | "approved" | "rejected") => {
  activeTab.value = tab;
};
watch(activeTab, (newTab) => {
  fetchInvoices(newTab);
});

const fetchInvoices = async (tab: "pending" | "approved" | "rejected") => {
  isFetchingInvoices.value = true;
  try {
    // In a real app: const data = await apiFetch(`/tracker?status=${tab}&page=1`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    let mockApiResponse;

    // Mock data for each tab
    if (tab === "pending") {
      mockApiResponse = {
        invoices: [
          {
            id: "1",
            number: "INV-0156",
            customerName: "Tech Solutions Ltd",
            irn: "INV...1A2B",
            submissionDate: "2025-10-08T10:00:00Z",
            amount: 150000,
            currency_code: "NGN",
            status: "Awaiting FIRS",
          },
        ],
        pagination: {
          current_page: 1,
          page_count: 1,
          total_pages_count: 1,
          total_records: 1,
        },
      };
    } else if (tab === "approved") {
      mockApiResponse = {
        invoices: [
          {
            id: "2",
            number: "INV-0150",
            customerName: "Global Exports",
            irn: "INV...ABCD",
            submissionDate: "2025-10-07T11:00:00Z",
            amount: 275000,
            currency_code: "NGN",
            status: "Approved",
          },
        ],
        pagination: {
          current_page: 1,
          page_count: 1,
          total_pages_count: 1,
          total_records: 1,
        },
      };
    } else {
      // Rejected
      mockApiResponse = {
        invoices: [
          {
            id: "3",
            number: "INV-0145",
            customerName: "Innovate Inc.",
            irn: "INV...EFGH",
            submissionDate: "2025-10-06T09:00:00Z",
            amount: 95000,
            currency_code: "NGN",
            status: "Rejected",
            rejectionReason: "Invalid VAT calculation.",
          },
        ],
        pagination: {
          current_page: 1,
          page_count: 1,
          total_pages_count: 1,
          total_records: 1,
        },
      };
    }
    rawInvoices.value = mockApiResponse.invoices as Invoice[];
    paginationData.value[tab] = mockApiResponse.pagination;
  } catch (error) {
    console.error(`Failed to fetch ${tab} invoices:`, error);
    rawInvoices.value = [];
  } finally {
    isFetchingInvoices.value = false;
  }
};

onMounted(() => {
  fetchInvoices("pending");
});

// --- HELPER FUNCTIONS ---
const formatDate = (isoString: string) => {
  const { d3, m4, y1 } = dateUtil.formatDate(isoString).getAll();
  return `${d3} ${m4}, ${y1}`;
};
</script>

<style lang="scss" scoped>
.invoice-tracker-page {
  @apply pt-4;
}
.page-header {
  @apply flex justify-between items-start mb-6;
}
.page-title {
  @apply text-2xl font-semibold text-grey-900;
}
.page-description {
  @apply text-grey-600 mt-1;
}
.table-section {
  @apply bg-neutral-10 p-6 sm:p-4 rounded-xl border border-grey-200/80;
}

.tabs-container {
  @apply flex items-center border-b border-b-grey-200 mb-6;
  .tab-item {
    @apply px-4 py-3 text-sm font-medium text-grey-500 border-b-2 border-transparent -mb-px transition-colors duration-200;
    &--active {
      @apply text-primary-900 border-b-primary-900;
    }
  }
}

.filter-bar {
  @apply flex justify-between items-center mb-6 pb-6 border-b border-b-grey-100;
  .search-input {
    @apply max-w-sm;
  }
  .filter-actions {
    @apply flex items-center gap-x-2;
  }
  .date-filter {
    @apply w-48;
  }
}

.pagination-container {
  @apply pt-6 border-t border-t-grey-100;
}
</style>
