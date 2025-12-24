<template>
  <AdminLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <SummaryCard/>
      <StatisticsChart/>
      <PieChart />
      <LineChart />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import SummaryCard from '@/components/dashboard/SummaryCard.vue'
import StatisticsChart from '@/components/dashboard/StatisticsChart.vue'
import PieChart from '@/components/dashboard/PieChart.vue'
import { useDashboardStore } from '@/stores/dashboard.ts'
import { showToast } from '@/plugins/Toast.ts'
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import LineChart from '@/components/dashboard/LineChart.vue'

const dashboardStore = useDashboardStore()
const { selectedOptions } = storeToRefs(dashboardStore)

const fetchDashboard = () => {
  dashboardStore
    .getDashboard()
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
      } else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to delete report!'
      showToast({ title: errorMessage, icon: 'error' })
    })
}

watch(selectedOptions, () => fetchDashboard())
onMounted(() => fetchDashboard())
</script>
