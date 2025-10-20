<template>
  <!-- CONTEXTUAL ACTION BAR -->
  <ContextualActionBar
    v-if="selectedInvoices.length"
    :selection-count="selectedInvoices.length"
    :show-primary-action="true"
    :show-secondary-action="false"
    :is-primary-loading="isSubmitting"
    :is-secondary-loading="false"
    primary-action-text="Submit Selected to FIRS"
    @primary-action-clicked="handleBulkSubmit"
  />

  <!-- TABLE SECTION -->
  <TableContainer
    :table-header="validTableHeader"
    :table-body="validInvoicesForTable"
    :is-loading="isFetchingInvoices"
    :empty-data="validEmptyDataConfig"
    :show-checkbox="true"
    :is-checked="isAllValidSelected"
    @checkboxChange="toggleSelectAll"
  >
    <!-- The v-for loop correctly iterates over the formatted data -->
    <TableContainerBody
      v-for="(invoice, index) in validInvoicesForTable"
      :key="index"
      :table-header="validTableHeader"
      :table-data="invoice"
      :show-checkbox="true"
      :is-checked="isAllValidSelected || selectedInvoices.includes(invoice.id)"
      @checkboxRowChange="toggleSelection(invoice.id)"
    />
  </TableContainer>

  <div
    v-if="!isFetchingInvoices && validPaginationData.total_records > 0"
    class="pagination-container"
  >
    <Pagination
      :page-description="validPaginationDesc"
      :paging-data="validPaginationData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from "vue";
import { useString } from "@/shared/composables/useString";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";
import ContextualActionBar from "../components/contextual-action-bar.vue";

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
const rawValidInvoices = ref<Invoice[]>([]);
const selectedInvoices = ref<string[]>([]);

// --- PAGINATION STATE ---
const validPaginationData = ref<IPaging>({
  current_page: 1,
  page_count: 0,
  total_pages_count: 1,
  total_records: 0,
});

const validPaginationDesc = computed(
  () =>
    `Showing ${validPaginationData.value.total_records > 0 ? 1 : 0}-${rawValidInvoices.value.length} of ${validPaginationData.value.total_records} invoices`
);

// --- TABLE CONFIGURATION ---
const validTableHeader = ref([
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "irn", title: "IRN" },
  { slug: "date", title: "Date" },
  { slug: "amount", title: "Amount" },
  { slug: "action", title: "Action" },
]);

const validEmptyDataConfig = {
  title: "No Invoices Ready",
  description:
    "Invoices with a valid IRN will appear here, ready for submission to FIRS.",
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

// --- SELECTION LOGIC ---
const toggleSelection = (invoiceId: string) => {
  const index = selectedInvoices.value.indexOf(invoiceId);
  if (index > -1) {
    selectedInvoices.value.splice(index, 1);
  } else {
    selectedInvoices.value.push(invoiceId);
  }
};

const toggleSelectAll = (event: boolean): void => {
  selectedInvoices.value = event
    ? rawValidInvoices.value.map((inv) => inv.id)
    : [];
};

const fetchInvoices = async () => {
  isFetchingInvoices.value = true;
  selectedInvoices.value = [];
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
    rawValidInvoices.value = mockApiResponse.invoices as Invoice[];
    validPaginationData.value = mockApiResponse.pagination;
  } catch (error) {
    console.error(`Failed to fetch valid invoices:`, error);
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
.pagination-container {
  @apply pt-6 border-t border-t-grey-100;
}
</style>
