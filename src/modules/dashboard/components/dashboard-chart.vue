<template>
  <div class="chart-container">
    <h2 class="section-title">Daily Invoice Sync</h2>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
  // --- TYPE IMPORTS FOR THE FIX ---
  type ChartOptions,
  type ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- INTERFACES ---
interface DailySyncData {
  date: string;
  count: number;
}

const props = defineProps<{
  dailySyncData: DailySyncData[];
}>();

// --- CHART DATA (Typed) ---
const chartData = computed<ChartData<"line">>(() => ({
  labels: props.dailySyncData.map((d) => d.date),
  datasets: [
    {
      label: "Invoices Synced",
      backgroundColor: "rgba(37, 65, 237, 0.1)",
      borderColor: "#2541ED",
      data: props.dailySyncData.map((d) => d.count),
      fill: true,
      tension: 0.4,
    },
  ],
}));

// --- CHART OPTIONS (FIX APPLIED HERE) ---
// By explicitly typing chartOptions with `ChartOptions<'line'>`,
// TypeScript can correctly infer the types and resolve the error.
const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        // drawBorder: false, // This is a valid property
      },
      ticks: {
        precision: 0, // Ensure y-axis shows whole numbers
      },
    },
    x: {
      grid: {
        display: false, // This is a valid property
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  @apply bg-neutral-10 p-6 rounded-xl border border-grey-200/60;
}
.section-title {
  @apply text-lg font-semibold text-grey-900 mb-4;
}
.chart-wrapper {
  @apply h-72 w-full;
}
</style>
