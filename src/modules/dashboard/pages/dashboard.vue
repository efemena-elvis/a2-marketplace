<template>
  <div class="dashboard-page">
    <!-- SECTION 1: STAT CARDS -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.title" class="stat-card">
        <div class="stat-header">
          <div class="icon-wrapper" :class="stat.bgColor">
            <div class="icon" :class="stat.icon"></div>
          </div>
          <span class="stat-title">{{ stat.title }}</span>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
        <p class="stat-description">{{ stat.description }}</p>
      </div>
    </div>

    <!-- SECTION 2: LINE CHART -->
    <div class="chart-container">
      <h2 class="section-title">Daily Invoice Sync</h2>
      <div class="chart-wrapper">
        <Line :data="chartData" :options="chartOptions as any" />
      </div>
    </div>

    <!-- SECTION 3: RECENT ACTIVITY -->
    <div class="recent-activity-container">
      <div class="section-header">
        <h2 class="section-title">Recently Synced Invoices</h2>
        <router-link to="/app/invoice-irn" class="btn btn-secondary btn-sm">
          View All Pending Invoices
        </router-link>
      </div>

      <!--
        CORRECT IMPLEMENTATION USING YOUR PROVIDED USAGE PATTERN
      -->
      <TableContainer
        :table-header="recentInvoicesHeader"
        :table-body="recentInvoicesForTable"
        :is-loading="isFetchingRecentInvoices"
        :empty-data="emptyDataConfig"
      >
        <!-- The v-for loop now correctly iterates over the tableBody passed to the component -->
        <TableContainerBody
          v-for="(invoice, index) in recentInvoicesForTable"
          :key="index"
          :table-header="recentInvoicesHeader"
          :table-data="invoice"
        />
      </TableContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import { useString } from "@/shared/composables/useString";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- INTERFACES AND TYPES ---
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  amount: number;
  currency_code: string;
  status:
    | "Pending IRN"
    | "Pending Validation"
    | "Awaiting FIRS"
    | "Approved"
    | "Rejected";
}
interface DailySyncData {
  date: string;
  count: number;
}

// --- COMPOSABLES ---
const { getStatus, getBoldTableText } = useString();

// --- REACTIVE STATE ---
const stats = ref([
  {
    title: "Total Synced Invoices",
    value: 0,
    description: "All invoices synced from ERP.",
    icon: "icon-document-text",
    bgColor: "bg-blue-100",
  },
  {
    title: "Pending IRN",
    value: 0,
    description: "Invoices ready for IRN generation.",
    icon: "icon-pen-edit",
    bgColor: "bg-yellow-100",
  },
  {
    title: "Pending Submission",
    value: 0,
    description: "Invoices with IRN ready for FIRS.",
    icon: "icon-shield-tick",
    bgColor: "bg-teal-100",
  },
  {
    title: "Approved by FIRS",
    value: 0,
    description: "Invoices successfully approved.",
    icon: "icon-tick-circle",
    bgColor: "bg-green-100",
  },
]);
const recentInvoices = ref<Invoice[]>([]);
const dailySyncData = ref<DailySyncData[]>([]);
const isFetchingRecentInvoices = ref<boolean>(true);

// Define the header structure for your TableContainer component
const recentInvoicesHeader = ref([
  { slug: "number", title: "Invoice #" },
  { slug: "customerName", title: "Customer" },
  { slug: "date", title: "Date" },
  { slug: "amount", title: "Amount" },
  { slug: "status", title: "Status" },
]);

// Configuration for the TableEmpty component when no recent invoices are found
const emptyDataConfig = {
  title: "No Recent Invoices",
  description:
    "New invoices will appear here once they are synced from your ERP.",
  actionText: "", // No action button needed in this context
};

// --- COMPUTED PROPERTY TO FORMAT DATA FOR THE TABLE ---
// Transforms the raw invoice data into the string/HTML format expected by your table components.
const recentInvoicesForTable = computed(() => {
  return recentInvoices.value.map((invoice) => ({
    id: invoice.id,
    number: getBoldTableText(invoice.number),
    customerName: invoice.customerName,
    date: formatDate(invoice.date),
    amount: formatCurrency(invoice.amount, invoice.currency_code),
    status: getStatus("pending", invoice.status),
  }));
});

// --- API LOGIC (MOCKED FOR DEMONSTRATION) ---
const fetchDashboardData = async () => {
  isFetchingRecentInvoices.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockApiResponse = {
      stats: {
        totalSynced: 156,
        pendingIrn: 12,
        pendingSubmission: 5,
        approvedByFirs: 89,
      },
      dailySync: [
        { date: "Oct 1", count: 5 },
        { date: "Oct 2", count: 8 },
        { date: "Oct 3", count: 3 },
        { date: "Oct 4", count: 12 },
        { date: "Oct 5", count: 7 },
        { date: "Oct 6", count: 9 },
        { date: "Oct 7", count: 15 },
      ],
      recentInvoices: [
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
        {
          id: "4",
          number: "INV-0153",
          customerName: "Market Movers",
          date: "2025-10-06",
          amount: 310000,
          currency_code: "NGN",
          status: "Pending IRN",
        },
        {
          id: "5",
          number: "INV-0152",
          customerName: "Pioneer Group",
          date: "2025-10-05",
          amount: 120000,
          currency_code: "NGN",
          status: "Pending IRN",
        },
      ],
    };

    stats.value[0].value = mockApiResponse.stats.totalSynced;
    stats.value[1].value = mockApiResponse.stats.pendingIrn;
    stats.value[2].value = mockApiResponse.stats.pendingSubmission;
    stats.value[3].value = mockApiResponse.stats.approvedByFirs;
    dailySyncData.value = mockApiResponse.dailySync;

    recentInvoices.value = mockApiResponse.recentInvoices as Invoice[];
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  } finally {
    isFetchingRecentInvoices.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});

// --- CHART CONFIGURATION ---
const chartData = computed(() => ({
  labels: dailySyncData.value.map((d) => d.date),
  datasets: [
    {
      label: "Invoices Synced",
      backgroundColor: "rgba(37, 65, 237, 0.1)",
      borderColor: "#2541ED",
      data: dailySyncData.value.map((d) => d.count),
      fill: true,
      tension: 0.4,
    },
  ],
}));
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { drawBorder: false } },
    x: { grid: { display: false } },
  },
};

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
    year: "numeric",
  });
</script>

<style lang="scss" scoped>
.dashboard-page {
  @apply pt-4 pb-8 flex flex-col gap-y-9;
}
.stats-grid {
  @apply grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-5;
}
.stat-card {
  @apply bg-neutral-10 p-5 rounded-xl border border-grey-200/80 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary-100;
}
.stat-header {
  @apply flex items-center gap-x-4 mb-4;
}
.icon-wrapper {
  @apply size-10 rounded-full flex items-center justify-center;
}
.icon-wrapper .icon {
  @apply text-xl;
}
.stat-title {
  @apply font-medium text-grey-700;
}
.stat-value {
  @apply text-4xl font-semibold text-grey-900 mb-2;
}
.stat-description {
  @apply text-sm text-grey-500;
}
.bg-blue-100 .icon {
  @apply text-blue-600;
}
.bg-yellow-100 .icon {
  @apply text-yellow-600;
}
.bg-teal-100 .icon {
  @apply text-teal-600;
}
.bg-green-100 .icon {
  @apply text-green-600;
}
.chart-container {
  @apply bg-neutral-10 p-6 rounded-xl border border-grey-200/80;
}
.chart-wrapper {
  @apply h-72 w-full;
}
.section-title {
  @apply text-lg font-semibold text-grey-900 mb-4;
}
.recent-activity-container {
  @apply bg-neutral-10 p-6 rounded-xl border border-grey-200/80;
}
.section-header {
  @apply flex justify-between items-center mb-4;
}
</style>
