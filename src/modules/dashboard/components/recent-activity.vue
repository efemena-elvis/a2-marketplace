<template>
  <div class="recent-activity-container">
    <div class="section-header">
      <h2 class="section-title">Recently Synced Invoices</h2>
      <router-link to="/invoice-irn" class="btn btn-secondary btn-sm">
        View All Pending Invoices
      </router-link>
    </div>

    <TableContainer
      :table-header="tableHeader"
      :table-body="invoicesForTable"
      :is-loading="isLoading"
      :empty-data="emptyDataConfig"
    >
      <TableContainerBody
        v-for="(invoice, index) in invoicesForTable"
        :key="index"
        :table-header="tableHeader"
        :table-data="invoice"
      />
    </TableContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import { useString } from "@/shared/composables/useString";

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  currency_code: string;
  status: string;
}

const props = defineProps<{
  recentInvoices: Invoice[];
  isLoading: boolean;
}>();

const { getStatus, getBoldTableText } = useString();

const tableHeader = ref([
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "date", title: "Date" },
  { slug: "amount", title: "Amount" },
  { slug: "status", title: "Status" },
]);

const emptyDataConfig = {
  title: "No Recent Invoices",
  description:
    "New invoices will appear here once they are synced from your ERP.",
};

const invoicesForTable = computed(() => {
  return props.recentInvoices.map((invoice) => ({
    id: invoice.id,
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    date: formatDate(invoice.date),
    amount: formatCurrency(invoice.amount, invoice.currency_code),
    status: getStatus("pending", invoice.status),
  }));
});

const formatCurrency = (value: number, currencyCode: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currencyCode,
  }).format(value);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
</script>

<style lang="scss" scoped>
.recent-activity-container {
  @apply bg-neutral-10 p-6 rounded-xl border border-grey-200/60;
}
.section-header {
  @apply flex justify-between items-center mb-4;
}
.section-title {
  @apply text-lg font-semibold text-grey-900;
}
</style>
