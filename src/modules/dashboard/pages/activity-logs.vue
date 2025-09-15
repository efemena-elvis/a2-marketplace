<template>
  <PageContentWrapper
    searchInputPlaceholder="Search activity logs"
    :filterActiveValue="activePeriod"
    :filterListValue="periodList"
    pageDescription="All logged activities"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful logs' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { useSettingsStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";

const { getStatus, notAvailable } = useString();

const { getAuditLogs } = useSettingsStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "", slug: "status" },
  { title: "Time Logged", slug: "date_created" },
  { title: "Initiated By", slug: "initiated_by" },
  { title: "Action Type", slug: "action_type" },
  { title: "Activity", slug: "activity" },
  // { title: "Action", slug: "action" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const activePeriod = ref<string>("This month");
const periodList = ref<string[]>([
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
  "All time",
]);

const processSearchEntry = (searchValue: string) => {
  console.log("SEARCH VALUE", searchValue);
};

const processFilterSelection = (selectedPeriod: string) => {
  console.log("FILTERING BY PERIOD", selectedPeriod);
};

const getUserName = (user: any) => {
  return user.first_name ? user.first_name + " " + user.last_name : user.email;
};

const getActivityDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchAuditLogs = async () => {
  const response = await processAPIRequest({
    action: getAuditLogs,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        status: getStatus("success"),
        date_created: getActivityDate(data.created_at),
        initiated_by: getUserName(data.user),
        action_type: data.action_type,
        activity: data.activity,
        // action: notAvailable("No action available"),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchAuditLogs();
});
</script>

<style lang="scss" scoped></style>
