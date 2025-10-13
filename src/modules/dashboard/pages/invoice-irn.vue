<template>
  <div class="generate-irn-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1 class="page-title">Generate IRN</h1>
      <div class="header-actions">
        <button
          class="btn btn-secondary btn-sm"
          @click="handleManualSync"
          :disabled="isLoading"
        >
          <div
            v-if="isLoading"
            class="icon icon-spinner-ios animate-spin"
          ></div>
          <span v-else>Manual Sync</span>
        </button>
      </div>
    </div>

    <!-- CONTEXTUAL ACTION BAR FOR BULK ACTIONS -->
    <div v-if="selectedInvoices.length" class="contextual-action-bar">
      <span class="selection-count"
        >{{ selectedInvoices.length }} invoices selected</span
      >
      <button
        class="btn btn-primary btn-sm"
        @click="handleBulkGenerateIRN"
        :disabled="isGeneratingIRN"
      >
        <div
          v-if="isGeneratingIRN"
          class="icon icon-spinner-ios animate-spin"
        ></div>
        <span v-else>Generate IRN for Selected</span>
      </button>
    </div>

    <!-- TABLE SECTION -->
    <div class="table-section">
      <!-- NEW: FILTER BAR -->
      <div class="filter-bar">
        <TextFieldInput
          input-type="search"
          input-placeholder="Search by Invoice # or Customer"
          class="search-input"
          :has-bottom-padding="false"
        />
        <div class="filter-actions">
          <SelectFieldInput
            input-placeholder="Filter by Date"
            class="date-filter"
            :has-bottom-padding="false"
          />
          <button class="btn btn-secondary btn-sm filter-btn">
            <div class="icon icon-filter-search"></div>
            <span>Filter</span>
          </button>
        </div>
      </div>

      <!-- TABLE CONTAINER WITH HEADER SLOT -->
      <TableContainer
        :table-header="tableHeader"
        :table-body="invoicesForTable"
        :is-loading="isFetchingInvoices"
        :empty-data="emptyDataConfig"
      >
        <!-- HEADER SLOT FOR THE CHECKBOX -->
        <template #header-checkbox>
          <input
            type="checkbox"
            class="sm-size"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
        </template>

        <!-- The default slot for the body uses a v-for -->
        <TableContainerBody
          v-for="(invoice, index) in invoicesForTable"
          :key="index"
          :table-header="tableHeader"
          :table-data="invoice"
          @click="toggleSelection(invoice.id)"
          class="cursor-pointer"
        />
      </TableContainer>

      <!-- PAGINATION -->
      <div
        v-if="!isFetchingInvoices && paginationData.total_records > 0"
        class="pagination-container"
      >
        <Pagination
          :page-description="paginationDescription"
          :paging-data="paginationData"
          :page-keys="pageKeys"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from "vue";
import { useString } from "@/shared/composables/useString";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

// --- INTERFACES AND TYPES ---
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  currency_code: string;
  status: "Pending IRN";
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
const isLoading = ref(false);
const isFetchingInvoices = ref(true);
const isGeneratingIRN = ref(false);
const rawInvoices = ref<Invoice[]>([]);
const selectedInvoices = ref<string[]>([]);

// --- PAGINATION STATE ---
const paginationData = ref<IPaging>({
  current_page: 1,
  page_count: 0,
  total_pages_count: 1,
  total_records: 0,
});
const paginationDescription = computed(() => {
  if (!paginationData.value.total_records) return "";
  const start =
    (paginationData.value.current_page - 1) * paginationData.value.page_count +
    1;
  const end = Math.min(
    paginationData.value.current_page * paginationData.value.page_count,
    paginationData.value.total_records
  );
  return `Showing ${start}-${end} of ${paginationData.value.total_records} invoices`;
});
const pageKeys = ref({ green: "", yellow: "", red: "" });

// --- TABLE CONFIGURATION (SIMPLIFIED) ---
const tableHeader = ref([
  { slug: "checkbox", title: "" }, // Title is now just a placeholder
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "date", title: "Date" },
  { slug: "amount", title: "Amount" },
  { slug: "action", title: "Action" },
]);

const emptyDataConfig = {
  title: "Inbox Zero!",
  description:
    "All of your synced invoices have been processed. Sync again to check for new ones.",
  actionText: "Sync Now",
};

// --- COMPUTED PROPERTIES ---
const invoicesForTable = computed(() => {
  return rawInvoices.value.map((invoice) => ({
    id: invoice.id,
    checkbox: h("input", {
      type: "checkbox",
      class: "sm-size",
      checked: selectedInvoices.value.includes(invoice.id),
      onClick: (e: Event) => e.stopPropagation(),
    }),
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    date: formatDate(invoice.date),
    amount: formatCurrency(invoice.amount, invoice.currency_code),
    action: h(
      "button",
      {
        class: "btn btn-secondary btn-sm",
        onClick: (e: Event) => {
          e.stopPropagation();
          handleSingleGenerateIRN(invoice.id);
        },
      },
      "Generate IRN"
    ),
  }));
});

const isAllSelected = computed(() => {
  return (
    rawInvoices.value.length > 0 &&
    selectedInvoices.value.length === rawInvoices.value.length
  );
});

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
    ? rawInvoices.value.map((inv) => inv.id)
    : [];
};

// --- API LOGIC ---
const fetchInvoices = async () => {
  isFetchingInvoices.value = true;
  selectedInvoices.value = [];
  try {
    // Replace with real apiFetch call: apiFetch("/invoices?status=pending_irn&page=1")
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockApiResponse = {
      invoices: [
        {
          id: "1",
          number: "INV-0156",
          customerName: "Tech Solutions Ltd",
          date: "2025-10-07",
          amount: 150000,
          currency_code: "NGN",
          status: "Pending IRN",
        },
        {
          id: "2",
          number: "INV-0155",
          customerName: "Global Exports",
          date: "2025-10-07",
          amount: 275000,
          currency_code: "NGN",
          status: "Pending IRN",
        },
        {
          id: "3",
          number: "INV-0154",
          customerName: "Innovate Inc.",
          date: "2025-10-06",
          amount: 95000,
          currency_code: "NGN",
          status: "Pending IRN",
        },
      ],
      pagination: {
        current_page: 1,
        page_count: 10,
        total_pages_count: 5,
        total_records: 48,
      },
    };
    rawInvoices.value = mockApiResponse.invoices;
    paginationData.value = mockApiResponse.pagination;
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    rawInvoices.value = [];
    paginationData.value.total_records = 0;
  } finally {
    isFetchingInvoices.value = false;
  }
};

const handleSingleGenerateIRN = async (invoiceId: string) => {
  await generateIRN([invoiceId]);
};
const handleBulkGenerateIRN = async () => {
  await generateIRN(selectedInvoices.value);
};

const generateIRN = async (invoiceIds: string[]) => {
  isGeneratingIRN.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    rawInvoices.value = rawInvoices.value.filter(
      (inv) => !invoiceIds.includes(inv.id)
    );
    paginationData.value.total_records -= invoiceIds.length;
    selectedInvoices.value = [];
    alert(
      `Successfully started IRN generation for ${invoiceIds.length} invoice(s).`
    );
  } catch (error) {
    console.error("Failed to generate IRN:", error);
  } finally {
    isGeneratingIRN.value = false;
  }
};

const handleManualSync = async () => {
  isLoading.value = true;
  await fetchInvoices();
  isLoading.value = false;
};

onMounted(() => {
  fetchInvoices();
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
.generate-irn-page {
  @apply pt-4;
}
.page-header {
  @apply flex justify-between items-center mb-6;
}
.page-title {
  @apply text-2xl font-semibold text-grey-900;
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

// New Filter Bar Styles
.filter-bar {
  @apply flex justify-between items-center mb-6 pb-6 border-b border-b-grey-100;
  .search-input {
    @apply max-w-sm;
  }
  .filter-actions {
    @apply flex items-center gap-x-2;
    .date-filter {
      @apply w-48;
    }
    .filter-btn {
      @apply h-[46px];
    }
  }
}

.pagination-container {
  @apply pt-6;
}
</style>
