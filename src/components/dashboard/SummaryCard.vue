<template>
  <div class="col-span-12 space-y-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      >
        <div
          class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"
        >
          <FontAwesomeIcon :icon="faFileArrowUp" class="text-2xl" />
        </div>

        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Report Submitted</span>
            <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {{ data?.statistic_data?.submitted ?? 0 }}
            </h4>
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      >
        <div
          class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"
        >
          <FontAwesomeIcon :icon="faFilePen" class="text-2xl" />
        </div>

        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Report Reviewed</span>
            <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {{ data?.statistic_data?.reviewed ?? 0 }}
            </h4>
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      >
        <div
          class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800"
        >
          <FontAwesomeIcon :icon="faFileCircleCheck" class="text-2xl" />
        </div>

        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Report Closed</span>
            <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {{ data?.statistic_data?.closed ?? 0 }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFileArrowUp, faFileCircleCheck, faFilePen } from '@fortawesome/free-solid-svg-icons'
import { useDashboardStore } from '@/stores/dashboard.ts'
import { storeToRefs } from 'pinia'

const dashboardStore = useDashboardStore()
const { data } = storeToRefs(dashboardStore)
</script>
