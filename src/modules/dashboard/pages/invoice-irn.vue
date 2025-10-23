<template>
  <PageLayout
    title="Invoice IRNs"
    description="All synchronized invoices with a generated IRN will appear here."
    :show-action-btn="true"
    action-text="Manual Sync"
    :is-action-loading="isSyncing"
    @on-action-clicked="handleManualSync"
  >
    <!-- TABLE SECTION -->
    <div class="table-section">
      <!-- FILTER BAR -->
      <FilterBar />

      <!-- CONTEXTUAL ACTION BAR -->
      <ContextualActionBar
        v-if="selectedInvoices.length"
        :selection-count="selectedInvoices.length"
        :show-primary-action="true"
        :show-secondary-action="true"
        :is-primary-loading="isGeneratingIRN"
        :is-secondary-loading="false"
        primary-action-text="Generate IRN"
        secondary-action-text="Validate IRN"
        @primary-action-clicked="handleBulkGenerateIRN"
        @secondary-action-clicked="handleBulkValidateIRN"
      />

      <!-- TABLE CONTAINER -->
      <TableContainer
        :table-header="tableHeader"
        :table-body="invoicesForTable"
        :is-loading="isFetchingInvoices"
        :empty-data="emptyDataConfig"
        :show-checkbox="true"
        :is-checked="isAllSelected"
        @checkboxChange="toggleSelectAll"
      >
        <TableContainerBody
          v-for="(invoice, index) in invoicesForTable"
          :key="index"
          :table-header="tableHeader"
          :table-data="invoice"
          :show-checkbox="true"
          :is-checked="isAllSelected || selectedInvoices.includes(invoice.id)"
          @checkboxRowChange="toggleSelection(invoice.id)"
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
        />
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useString } from "@/shared/composables/useString";
import useEvents from "@/shared/composables/useEvents";
import dateUtil from "@/shared/composables/useDate";
import { useDashboardStore } from "@/modules/dashboard/store";
// Import all components
import PageLayout from "@/shared/components/global-comps/page-layout.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableActionBtn from "@/shared/components/table-comps/table-action-btn.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";
import FilterBar from "../components/filter-bar.vue";
import ContextualActionBar from "../components/contextual-action-bar.vue";

// --- INTERFACES AND TYPES ---
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  irn: string;
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
const route = useRoute();

const { fetchBusinessInvoices } = useDashboardStore();
const { processAPIRequest } = useEvents();

const { getBoldTableText, maskCode, formatNumber } = useString();

// --- REACTIVE STATE ---
const isSyncing = ref(false);
const isFetchingInvoices = ref(true);
const isGeneratingIRN = ref(false);
const rawInvoices = ref<Invoice[]>([]);
const selectedInvoices = ref<string[]>([]);

const paginationData = ref<IPaging>({
  current_page: 1,
  page_count: 0,
  total_pages_count: 1,
  total_records: 0,
});

// --- WATCHER FOR ROUTE-DRIVEN DATA FETCHING ---
watch(
  () => route.query,
  () => {
    fetchInvoices();
  },
  { deep: true }
);

const getInvoiceDate = (date: string) => {
  let { m4, d3, y1 } = dateUtil.formatDate(date).getAll();
  return `${m4} ${d3}, ${y1}`;
};

// --- METHODS ---
const fetchInvoices = async () => {
  isFetchingInvoices.value = true;
  selectedInvoices.value = [];
  try {
    const { search, filter, page } = route.query;

    console.log(
      `Fetching invoices with search: ${search}, filter: ${filter}, page: ${page}`
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await processAPIRequest({
      action: fetchBusinessInvoices,
      payload: {},
    });

    console.log("INVOICES", response);

    const mockApiResponse = {
      invoices: [
        {
          id: "1",
          number: "INV-0156",
          customerName: "Tech Solutions Ltd",
          date: "2025-10-07",
          amount: 150000,
          irn: "INV233okj009183hh13442",
          currency_code: "NGN",
          status: "Pending IRN",
        },
        {
          id: "2",
          number: "INV-0155",
          customerName: "Global Exports",
          date: "2025-10-07",
          amount: 275000,
          irn: "",
          currency_code: "NGN",
          status: "Pending IRN",
        },
      ],
      pagination: {
        current_page: Number(page) || 1,
        page_count: 10,
        total_pages_count: 5,
        total_records: 48,
      },
    };

    rawInvoices.value = mockApiResponse.invoices as Invoice[];
    paginationData.value = mockApiResponse.pagination;
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    rawInvoices.value = [];
    paginationData.value.total_records = 0;
  } finally {
    isFetchingInvoices.value = false;
  }
};

const handleManualSync = async () => {
  isSyncing.value = true;
  console.log("Manual sync triggered!");
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate sync
  await fetchInvoices(); // Re-fetch the list after sync
  isSyncing.value = false;
};

const handleSingleGenerateIRN = async (invoiceId: string) => {
  console.log("Generate IRN clicked for invoice:", invoiceId);
  // await generateIRN([invoiceId]);
};

const handleSingleValidateIRN = async (invoiceId: string) => {
  console.log("Validate IRN clicked for invoice:", invoiceId);
  // await generateIRN([invoiceId]);
};

const handleBulkGenerateIRN = async () => {
  await generateIRN(selectedInvoices.value);
};

const handleBulkValidateIRN = async () => {
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

const toggleSelection = (invoiceId: string) => {
  const index = selectedInvoices.value.indexOf(invoiceId);
  if (index > -1) {
    selectedInvoices.value.splice(index, 1);
  } else {
    selectedInvoices.value.push(invoiceId);
  }
};

const toggleSelectAll = (event: boolean): void => {
  selectedInvoices.value = event ? rawInvoices.value.map((inv) => inv.id) : [];
};

onMounted(() => {
  fetchInvoices();
});

// --- TABLE CONFIG, COMPUTED PROPERTIES, HELPERS ---
const tableHeader = ref([
  { slug: "date", title: "Date Created" },
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer Name" },
  { slug: "amount", title: "Amount" },
  { slug: "irn", title: "IRN #" },
  { slug: "action", title: "Actions" },
]);

const emptyDataConfig = {
  title: "No Invoice Available!",
  description:
    "All of your synced invoices have been processed. Sync again to check for new ones.",
  actionText: "Sync Now",
};

const invoicesForTable = computed(() => {
  return rawInvoices.value.map((invoice) => ({
    id: invoice.id,
    date: getInvoiceDate(invoice.date),
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    amount: getBoldTableText(
      `${invoice.currency_code} ${formatNumber(invoice.amount)}`
    ),
    irn: invoice.irn ? maskCode(invoice.irn) : "-------",
    action: h(TableActionBtn, {
      showPrimaryBtn: true,
      showSecondaryBtn: true,
      showSecondaryText: true,
      primaryBtnText: "Generate IRN",
      secondaryBtnText: "Validate IRN",
      secondaryBtnIcon: "",
      isSecondaryActionDelete: false,
      onPrimaryActionClicked: () => handleSingleGenerateIRN(invoice.id),
      onSecondaryActionClicked: () => handleSingleValidateIRN(invoice.id),
    }),
  }));
});

const isAllSelected = computed(() => {
  return (
    rawInvoices.value.length > 0 &&
    selectedInvoices.value.length === rawInvoices.value.length
  );
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
</script>

<style lang="scss" scoped>
.table-section {
  @apply bg-neutral-10 p-5 sm:p-4 rounded-xl border border-grey-200/65;
}

.pagination-container {
  @apply pt-6;
}
</style>
