<template>
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
    />
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
const rawInvalidInvoices = ref<Invoice[]>([]);
const selectedInvoices = ref<string[]>([]);

// --- PAGINATION STATE ---
const invalidPaginationData = ref<IPaging>({
  current_page: 1,
  page_count: 0,
  total_pages_count: 1,
  total_records: 0,
});
const invalidPaginationDesc = computed(
  () =>
    `Showing ${invalidPaginationData.value.total_records > 0 ? 1 : 0}-${rawInvalidInvoices.value.length} of ${invalidPaginationData.value.total_records} invoices`
);

// --- TABLE CONFIGURATION ---
const invalidTableHeader = ref([
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "irn", title: "IRN" },
  { slug: "errorReason", title: "Reason for Invalidity" },
  { slug: "action", title: "Action" },
]);
const invalidEmptyDataConfig = {
  title: "No Invalid Invoices",
  description: "Invoices that failed internal validation will be listed here.",
};

// --- COMPUTED PROPERTIES ---
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

const fetchInvoices = async () => {
  isFetchingInvoices.value = true;
  selectedInvoices.value = [];
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockApiResponse = {
      invoices: [
        // {
        //   id: "3",
        //   number: "INV-0154",
        //   customerName: "Innovate Inc.",
        //   irn: "INV...5E6F",
        //   date: "2025-10-06",
        //   amount: 95000,
        //   currency_code: "NGN",
        //   status: "Invalid",
        //   errorReason: "Customer TIN is missing.",
        // },
      ],
      pagination: {
        current_page: 1,
        page_count: 1,
        total_pages_count: 1,
        total_records: 1,
      },
    };
    rawInvalidInvoices.value = mockApiResponse.invoices as Invoice[];
    invalidPaginationData.value = mockApiResponse.pagination;
  } catch (error) {
    console.error(`Failed to fetch invalid invoices:`, error);
  } finally {
    isFetchingInvoices.value = false;
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
