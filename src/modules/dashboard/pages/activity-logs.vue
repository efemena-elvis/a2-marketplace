<template>
  <div class="audit-logs-page">
    <!-- PAGE HEADER -->
    <div class="page-header">
      <h1 class="page-title">Activity Logs</h1>
      <p class="page-description">
        Track all important activities and events that happen in your account.
      </p>
    </div>

    <!-- MAIN CONTENT CARD -->
    <div class="table-section">
      <!-- AUDIT LOGS TABLE -->
      <TableContainer
        :table-header="tableHeader"
        :table-body="logsForTable"
        :is-loading="isLoading"
        :empty-data="emptyDataConfig"
      >
        <TableContainerBody
          v-for="(log, index) in logsForTable"
          :key="index"
          :table-header="tableHeader"
          :table-data="log"
          class="!cursor-default"
        />
      </TableContainer>

      <!-- PAGINATION -->
      <div v-if="!isLoading && auditLogs.length" class="pagination-container">
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
import dateUtil from "@/shared/composables/useDate";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import Pagination from "@/shared/components/global-comps/pagination.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";

// --- INTERFACES AND TYPES ---
interface AuditLog {
  id: string;
  event: string;
  user: {
    name: string;
    email: string;
  };
  details: string;
  ipAddress: string;
  timestamp: string; // ISO 8601 date string
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
const isLoading = ref(true);
const auditLogs = ref<AuditLog[]>([]);

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
  return `Showing ${start}-${end} of ${paginationData.value.total_records} logs`;
});
const pageKeys = ref({ green: "", yellow: "", red: "" });

// --- TABLE CONFIGURATION ---
const tableHeader = ref([
  { slug: "event", title: "Event" },
  { slug: "user", title: "User" },
  { slug: "details", title: "Details" },
  { slug: "ipAddress", title: "IP Address" },
  { slug: "timestamp", title: "Date & Time" },
]);

const emptyDataConfig = {
  title: "No Activity Yet",
  description:
    "Important account activities will be logged and displayed here for your review.",
};

// --- COMPUTED PROPERTIES ---
const logsForTable = computed(() => {
  return auditLogs.value.map((log) => ({
    id: log.id,
    event: getBoldTableText(log.event),
    user: `${log.user.name} <span class="text-grey-500">(${log.user.email})</span>`,
    details: log.details,
    ipAddress: log.ipAddress,
    timestamp: formatTimestamp(log.timestamp),
  }));
});

// --- API LOGIC (MOCKED) ---
const fetchAuditLogs = async () => {
  isLoading.value = true;
  try {
    // In a real app: const data = await apiFetch('/app/audit-logs?page=1');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockApiResponse = {
      logs: [
        {
          id: "1",
          event: "User Login",
          user: { name: "John Doe", email: "john@megatech.com" },
          details: "User successfully logged in.",
          ipAddress: "102.89.47.11",
          timestamp: "2025-10-07T14:30:00Z",
        },
        {
          id: "2",
          event: "API Key Generated",
          user: { name: "John Doe", email: "john@megatech.com" },
          details: "A new API key was generated.",
          ipAddress: "102.89.47.11",
          timestamp: "2025-10-07T14:25:00Z",
        },
        {
          id: "3",
          event: "Profile Updated",
          user: { name: "Jane Smith", email: "jane@megatech.com" },
          details: "Contact information was updated.",
          ipAddress: "192.168.1.5",
          timestamp: "2025-10-06T11:05:00Z",
        },
        {
          id: "4",
          event: "Invoice Submitted",
          user: { name: "John Doe", email: "john@megatech.com" },
          details: "Invoice INV-0156 submitted to FIRS.",
          ipAddress: "102.89.47.11",
          timestamp: "2025-10-05T09:15:00Z",
        },
        {
          id: "5",
          event: "IRN Generated",
          user: { name: "John Doe", email: "john@megatech.com" },
          details: "IRN generated for Invoice INV-0156.",
          ipAddress: "102.89.47.11",
          timestamp: "2025-10-05T09:14:00Z",
        },
      ],
      pagination: {
        current_page: 1,
        page_count: 5,
        total_pages_count: 10,
        total_records: 50,
      },
    };
    auditLogs.value = mockApiResponse.logs;
    paginationData.value = mockApiResponse.pagination;
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    auditLogs.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAuditLogs();
});

// --- HELPER FUNCTIONS ---
const formatTimestamp = (isoString: string) => {
  const { d3, m4, y1, h01, b2, a0 } = dateUtil.formatDate(isoString).getAll();
  return `${d3} ${m4}, ${y1} at ${h01}:${b2}${a0}`;
};
</script>

<style lang="scss" scoped>
.audit-logs-page {
  @apply pt-4 md:p-6 sm:p-4;
}

.page-header {
  @apply mb-8;
  .page-title {
    @apply text-2xl font-semibold text-grey-900;
  }
  .page-description {
    @apply text-grey-600 mt-1;
  }
}

.table-section {
  @apply bg-neutral-10 p-6 sm:p-4 rounded-xl border border-grey-200/80;
}

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
