<template>
  <div class="invoice-compliance-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Invoice Compliance</h1>
        <p class="page-description">
          Review invoices with a generated IRN. Submit valid invoices to FIRS or
          review errors for those that require attention.
        </p>
      </div>
    </div>

    <!-- CONTEXTUAL ACTION BAR FOR BULK ACTIONS (Only for 'valid' tab) -->
    <div
      v-if="selectedInvoices.length && activeTab === 'valid'"
      class="contextual-action-bar"
    >
      <span class="selection-count"
        >{{ selectedInvoices.length }} invoices selected</span
      >
      <button
        class="btn btn-primary btn-sm"
        @click="handleBulkSubmit"
        :disabled="isSubmitting"
      >
        <div
          v-if="isSubmitting"
          class="icon icon-spinner-ios animate-spin"
        ></div>
        <span v-else>Submit Selected to FIRS</span>
      </button>
    </div>

    <!-- TABLE SECTION -->
    <div class="table-section">
      <!-- TABS -->
      <div class="tabs-container">
        <button
          @click="setActiveTab('valid')"
          :class="['tab-item', { 'tab-item--active': activeTab === 'valid' }]"
        >
          Ready for Submission ({{ validPaginationData.total_records }})
        </button>
        <button
          @click="setActiveTab('invalid')"
          :class="['tab-item', { 'tab-item--active': activeTab === 'invalid' }]"
        >
          Requires Attention ({{ invalidPaginationData.total_records }})
        </button>
      </div>

      <!-- TABLE CONTAINER FOR 'VALID' INVOICES -->
      <div v-show="activeTab === 'valid'">
        <TableContainer
          :table-header="validTableHeader"
          :table-body="validInvoicesForTable"
          :is-loading="isFetchingInvoices"
          :empty-data="validEmptyDataConfig"
        >
          <!-- HEADER SLOT FOR THE CHECKBOX -->
          <template #header-checkbox>
            <input
              type="checkbox"
              class="sm-size"
              :checked="isAllValidSelected"
              @change="toggleSelectAll"
            />
          </template>

          <!-- The v-for loop correctly iterates over the formatted data -->
          <TableContainerBody
            v-for="(invoice, index) in validInvoicesForTable"
            :key="index"
            :table-header="validTableHeader"
            :table-data="invoice"
            @click="toggleSelection(invoice.id)"
            class="cursor-pointer"
          />
        </TableContainer>
        <div
          v-if="!isFetchingInvoices && validPaginationData.total_records > 0"
          class="pagination-container"
        >
          <Pagination
            :page-description="validPaginationDesc"
            :paging-data="validPaginationData"
            :page-keys="pageKeys"
          />
        </div>
      </div>

      <!-- TABLE CONTAINER FOR 'INVALID' INVOICES -->
      <div v-show="activeTab === 'invalid'">
        <TableContainer
          :table-header="invalidTableHeader"
          :table-body="invalidInvoicesForTable"
          :is-loading="isFetchingInvoices"
          :empty-data="invalidEmptyDataConfig"
        >
          <TableContainerBody
            v-for="(invoice, index) in invalidInvoicesForTable"
            :key="index"
            :table-header="invalidTableHeader"
            :table-data="invoice"
            class="!cursor-default"
          />
        </TableContainer>
        <div
          v-if="!isFetchingInvoices && invalidPaginationData.total_records > 0"
          class="pagination-container"
        >
          <Pagination
            :page-description="invalidPaginationDesc"
            :paging-data="invalidPaginationData"
            :page-keys="pageKeys"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h, watch } from "vue";
import { useString } from "@/shared/composables/useString";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";

// --- INTERFACES AND TYPES ---
type InvoiceStatus = "Pending Validation" | "Invalid";
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  irn: string;
  date: string;
  amount: number;
  currency_code: string;
  status: InvoiceStatus;
  errorReason?: string;
}
interface IPaging {
  current_page: number;
  page_count: number;
  total_pages_count: number;
  total_records: number;
}

// --- COMPOSABLES ---
const { getBoldTableText } = useString();

// --- REACTIVE STATE ---
const isFetchingInvoices = ref(true);
const isSubmitting = ref(false);
const activeTab = ref<"valid" | "invalid">("valid");
const rawValidInvoices = ref<Invoice[]>([]);
const rawInvalidInvoices = ref<Invoice[]>([]);
const selectedInvoices = ref<string[]>([]);

// --- PAGINATION STATE ---
const validPaginationData = ref<IPaging>({
  current_page: 1,
  page_count: 0,
  total_pages_count: 1,
  total_records: 0,
});
const invalidPaginationData = ref<IPaging>({
  current_page: 1,
  page_count: 0,
  total_pages_count: 1,
  total_records: 0,
});
const validPaginationDesc = computed(
  () =>
    `Showing ${validPaginationData.value.total_records > 0 ? 1 : 0}-${rawValidInvoices.value.length} of ${validPaginationData.value.total_records} invoices`
);
const invalidPaginationDesc = computed(
  () =>
    `Showing ${invalidPaginationData.value.total_records > 0 ? 1 : 0}-${rawInvalidInvoices.value.length} of ${invalidPaginationData.value.total_records} invoices`
);
const pageKeys = ref({ green: "", yellow: "", red: "" });

// --- TABLE CONFIGURATION ---
const validTableHeader = ref([
  { slug: "checkbox", title: "" }, // Placeholder for slot
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "irn", title: "IRN" },
  { slug: "date", title: "Date" },
  { slug: "amount", title: "Amount" },
  { slug: "action", title: "Action" },
]);
const invalidTableHeader = ref([
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "irn", title: "IRN" },
  { slug: "errorReason", title: "Reason for Invalidity" },
  { slug: "action", title: "Action" },
]);
const validEmptyDataConfig = {
  title: "No Invoices Ready",
  description:
    "Invoices with a valid IRN will appear here, ready for submission to FIRS.",
};
const invalidEmptyDataConfig = {
  title: "No Invalid Invoices",
  description: "Invoices that failed internal validation will be listed here.",
};

// --- COMPUTED PROPERTIES ---
const isAllValidSelected = computed(
  () =>
    rawValidInvoices.value.length > 0 &&
    selectedInvoices.value.length === rawValidInvoices.value.length
);
const validInvoicesForTable = computed(() =>
  rawValidInvoices.value.map((invoice) => ({
    id: invoice.id,
    checkbox: h("input", {
      type: "checkbox",
      class: "sm-size",
      checked: selectedInvoices.value.includes(invoice.id),
      onClick: (e: Event) => e.stopPropagation(),
    }),
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    irn: invoice.irn,
    date: formatDate(invoice.date),
    amount: formatCurrency(invoice.amount, invoice.currency_code),
    action: h(
      "button",
      {
        class: "btn btn-primary btn-sm",
        onClick: (e: Event) => {
          e.stopPropagation();
          handleSingleSubmit(invoice.id);
        },
      },
      "Submit to FIRS"
    ),
  }))
);
const invalidInvoicesForTable = computed(() =>
  rawInvalidInvoices.value.map((invoice) => ({
    id: invoice.id,
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    irn: invoice.irn,
    errorReason: `<span class="text-red-600">${invoice.errorReason}</span>`,
    action: h(
      "button",
      {
        class: "btn btn-secondary btn-sm",
        onClick: () => handleReSync(invoice.id),
      },
      "Re-sync"
    ),
  }))
);

// --- SELECTION LOGIC ---
const toggleSelection = (invoiceId: string) => {
  const index = selectedInvoices.value.indexOf(invoiceId);
  if (index > -1) {
    selectedInvoices.value.splice(index, 1);
  } else {
    selectedInvoices.value.push(invoiceId);
  }
};
const toggleSelectAll = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  selectedInvoices.value = isChecked
    ? rawValidInvoices.value.map((inv) => inv.id)
    : [];
};

// --- API LOGIC ---
const setActiveTab = (tab: "valid" | "invalid") => {
  activeTab.value = tab;
};
watch(activeTab, (newTab) => {
  fetchInvoices(newTab);
});

const fetchInvoices = async (tab: "valid" | "invalid") => {
  isFetchingInvoices.value = true;
  selectedInvoices.value = [];
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (tab === "valid") {
      const mockApiResponse = {
        invoices: [
          {
            id: "1",
            number: "INV-0156",
            customerName: "Tech Solutions Ltd",
            irn: "INV...1A2B",
            date: "2025-10-07",
            amount: 150000,
            currency_code: "NGN",
            status: "Pending Validation",
          },
          {
            id: "2",
            number: "INV-0155",
            customerName: "Global Exports",
            irn: "INV...3C4D",
            date: "2025-10-07",
            amount: 275000,
            currency_code: "NGN",
            status: "Pending Validation",
          },
        ],
        pagination: {
          current_page: 1,
          page_count: 2,
          total_pages_count: 1,
          total_records: 2,
        },
      };
      rawValidInvoices.value = mockApiResponse.invoices;
      validPaginationData.value = mockApiResponse.pagination;
    } else {
      const mockApiResponse = {
        invoices: [
          {
            id: "3",
            number: "INV-0154",
            customerName: "Innovate Inc.",
            irn: "INV...5E6F",
            date: "2025-10-06",
            amount: 95000,
            currency_code: "NGN",
            status: "Invalid",
            errorReason: "Customer TIN is missing.",
          },
        ],
        pagination: {
          current_page: 1,
          page_count: 1,
          total_pages_count: 1,
          total_records: 1,
        },
      };
      rawInvalidInvoices.value = mockApiResponse.invoices;
      invalidPaginationData.value = mockApiResponse.pagination;
    }
  } catch (error) {
    console.error(`Failed to fetch ${tab} invoices:`, error);
  } finally {
    isFetchingInvoices.value = false;
  }
};

const handleSingleSubmit = async (invoiceId: string) => {
  await submitToFirs([invoiceId]);
};
const handleBulkSubmit = async () => {
  await submitToFirs(selectedInvoices.value);
};

const submitToFirs = async (invoiceIds: string[]) => {
  isSubmitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    rawValidInvoices.value = rawValidInvoices.value.filter(
      (inv) => !invoiceIds.includes(inv.id)
    );
    validPaginationData.value.total_records -= invoiceIds.length;
    selectedInvoices.value = [];
    alert(
      `Successfully submitted ${invoiceIds.length} invoice(s) to FIRS. They have been moved to the Invoice Tracker.`
    );
  } catch (error) {
    console.error("Failed to submit to FIRS:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleReSync = async (invoiceId: string) => {
  alert(
    `Re-syncing invoice #${invoiceId}. It will be removed from this list and re-appear in the 'Generate IRN' page after the next sync.`
  );
  rawInvalidInvoices.value = rawInvalidInvoices.value.filter(
    (inv) => inv.id !== invoiceId
  );
  invalidPaginationData.value.total_records--;
};

onMounted(() => {
  fetchInvoices("valid");
});

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number, currencyCode: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
</script>

<style lang="scss" scoped>
.invoice-compliance-page {
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
.contextual-action-bar {
  @apply bg-primary-50 border border-primary-200 rounded-lg p-3 mb-6 flex justify-between items-center animate-slide-down;
}
.selection-count {
  @apply text-sm font-medium text-primary-900;
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

.pagination-container {
  @apply pt-6 border-t border-t-grey-100;
}
</style>
