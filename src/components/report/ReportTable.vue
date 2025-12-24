<template>
  <div>
    <!-- Search -->
    <input
      v-model="search"
      type="text"
      placeholder="Search..."
      class="mb-4 w-full px-4 py-2 border rounded focus:border-blue-400 focus-visible:border-blue-400"
    />

    <!-- Table -->
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full border">
          <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th v-for="(column, key) in columns"
                v-bind:key
                class="px-5 py-3 text-left sm:px-6 cursor-pointer"
                :class="'w-3/' + columns.length"
            >
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ column.title }}</p>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(value, index) in reports"
            :key="index"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.location }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.category }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.risk_score }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.risk_level }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.status.toUpperCase() }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.creator?.name }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ value.report_date }}</p>
            </td>
            <td class="">
              <div class="flex justify-center items-center gap-1">
                <button @click="openModal(value.id, 'view')">
                  <FontAwesomeIcon :icon="faEye" class="text-blue-600" />
                </button>
                <button v-if="value.status === 'draft'" @click="openModal(value.id, 'edit')">
                  <FontAwesomeIcon :icon="faPencil" class="text-amber-600" />
                </button>
                <button v-if="user?.user_roles?.includes('SPV') && ['submitted', 'reviewed'].includes(value.status)" @click="openModal(value.id, 'review')">
                  <FontAwesomeIcon :icon="faPencil" class="text-amber-600" />
                </button>
                <button v-if="value.status === 'draft'" @click="deleteReport(value.id)">
                  <FontAwesomeIcon :icon="faTrash" class="text-red-600" />
                </button>
                <button v-if="user?.user_roles?.includes('Admin')" @click="deleteReport(value.id)">
                  <FontAwesomeIcon :icon="faTrash" class="text-red-600" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="reports.length === 0">
            <td colspan="7" class="px-5 py-4 sm:px-6" align="center">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">No Data</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
      <span class="text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span class="font-semibold text-heading">{{ paginationData.from }}-{{ paginationData.to }}</span> of <span class="font-semibold text-heading">{{ paginationData.total }}</span></span>
      <ul class="flex -space-x-px text-sm">
        <li>
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            type="button"
            class="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm px-3 h-9 focus:outline-none"
          >
            Previous
          </button>
        </li>
        <li
          v-for="page in pages"
          :key="page"
        >
          <button
            type="button"
            @click="typeof page === 'number' && (currentPage = page)"
            :class="{ active: currentPage === page }"
            class="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-9 h-9 focus:outline-none"
          >
            {{ page }}
          </button>
        </li>
        <li>
          <button
            @click="currentPage++"
            :disabled="currentPage === pages.length"
            type="button"
            class="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-base text-sm px-3 h-9 focus:outline-none"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useReportStore } from '@/stores/report.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPencil, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.ts'

const search = ref('')
const currentPage = ref(1)

const columns = [
  {
    title: 'Location',
    field: 'location',
  },
  {
    title: 'Category',
    field: 'category',
  },
  {
    title: 'Risk Score',
    field: 'risk_score',
  },
  {
    title: 'Risk Level',
    field: 'risk_level',
  },
  {
    title: 'Status',
    field: 'status',
  },
  {
    title: 'Reported By',
  },
  {
    title: 'Report Date',
    field: 'report_date',
  },
  {
    title: '',
    field: '',
  }
]

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const reportStore = useReportStore()
const { pagination, reports } = storeToRefs(reportStore)

const paginationData = pagination
const totalPages = computed(() => {
  const total = paginationData.total || 1
  const perPage = paginationData.per_page || 1
  return Math.ceil(total / perPage)
})
const pages = computed<(number | string)[]>(() => {
  const pagesArray: (number | string)[] = []

  if (totalPages.value <= 7) {
    // if few pages, show all
    for (let i = 1; i <= totalPages.value; i++) {
      pagesArray.push(i)
    }
  } else {
    const start = Math.max(2, currentPage.value - Math.floor(5 / 2))
    const end = Math.min(totalPages.value - 1, currentPage.value + Math.floor(5 / 2))

    pagesArray.push(1)

    if (start > 2) pagesArray.push("...")

    for (let i = start; i <= end; i++) pagesArray.push(i)

    if (end < totalPages.value - 1) pagesArray.push("...")

    pagesArray.push(totalPages.value)
  }
  return pagesArray
})

const fetchReports = async () => {
  const payload = {
    search: search.value,
    page: currentPage.value,
  }

  await reportStore
    .fetchReports(payload)
}

const emit = defineEmits<{
  (e: string, id: number, type?: string): void
}>()

const openModal = (id: number, type: string): void => {
  emit('open-modal', id, type)
}

const deleteReport = (id: number) => {
  emit('delete', id)
}

watch(currentPage, fetchReports)
watch(search, fetchReports)
onMounted(fetchReports)
</script>
