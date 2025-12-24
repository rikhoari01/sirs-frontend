<template>
  <div class="col-span-12 lg:col-md-6">
    <div
      class="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
    >
      <div class="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div class="w-full">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
          <p class="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Report By Risk Level
          </p>
        </div>

        <div class="relative">
          <div class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <button
              v-for="option in options"
              :key="option"
              @click="selectedOptions = option"
              :class="[
              selectedOptions === option
                ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
                : 'text-gray-500 dark:text-gray-400',
              'px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 hover:shadow-theme-xs dark:hover:bg-gray-800 dark:hover:text-white',
            ]"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartThree" class="w-full">
          <div v-if="data.length === 0" class="loading-container flex flex-col justify-center items-center gap-2">
            <span
              class="mr-2 animate-spin border-2 border-b-blue-500 border-t-transparent rounded-full w-8 h-8"
            ></span>
            Loading...
          </div>

          <VueApexCharts v-else type="bar" height="310" :options="chartOptions" :series="series" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useDashboardStore } from '@/stores/dashboard.ts'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { options, selectedOptions, data } = storeToRefs(dashboardStore)

const series = ref([])
const chartOptions = ref({
  chart: {
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "60%",
      borderRadius: 6
    }
  },
  colors: ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"],
  dataLabels: { enabled: false },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: "Total Reports"
    }
  },
  legend: {
    position: "top",
    horizontalAlign: "right"
  },
  grid: {
    strokeDashArray: 4
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: val => `${val} Reports`
    }
  },
})

watch(data, (value) => {
  series.value = value?.bar_chart_data?.series || []
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: value?.bar_chart_data?.categories || []
    }
  }
})
</script>
