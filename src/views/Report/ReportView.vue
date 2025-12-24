<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Reports'" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Report List">
        <template #button>
          <button
            @click="isModalReportOpen = true"
            type="button"
            class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            Add Report
          </button>
        </template>

        <ReportTable @open-modal="openModal" @delete="deleteReport" />
      </ComponentCard>
    </div>
  </AdminLayout>

  <Modal v-if="isModalReportOpen" @close="isModalReportOpen = false">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <!-- close btn -->
        <button
          @click="isModalReportOpen = false"
          class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
        >
          <svg
            class="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
              fill=""
            />
          </svg>
        </button>

        <!-- content -->
        <div class="px-2 pr-14">
          <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {{ modal.title }}
          </h4>
          <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
            {{ modal.description }}
          </p>
        </div>
        <form class="flex flex-col">
          <div class="custom-scrollbar overflow-y-auto p-2">
            <div class="space-y-5">
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div class="col-span-2 lg:col-span-1">
                  <label
                    for="location"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Location<span class="text-error-500">*</span>
                  </label>
                  <input
                    :disabled="isLoading || ['view', 'review'].includes(modalType)"
                    type="text"
                    v-model="form.location"
                    name="location"
                    placeholder="Enter the location of incident"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div class="col-span-2 lg:col-span-1">
                  <label
                    for="category"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Category
                  </label>
                  <input
                    :disabled="isLoading || ['view', 'review'].includes(modalType)"
                    type="text"
                    v-model="form.category"
                    name="category"
                    placeholder="Enter the category of incident"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div>
                <label
                  for="description"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Description<span class="text-error-500">*</span>
                </label>
                <textarea
                  :disabled="isLoading || ['view', 'review'].includes(modalType)"
                  v-model="form.description"
                  rows="5"
                  name="description"
                  placeholder="Enter the description of incident"
                  class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div class="col-span-2 lg:col-span-1">
                  <label
                    for="severity"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Severity
                  </label>
                  <input
                    :disabled="isLoading || modalType === 'view'"
                    type="number"
                    v-model.number="form.severity"
                    name="severity"
                    placeholder="Enter the severity of incident"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div class="col-span-2 lg:col-span-1">
                  <label
                    for="probability"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Probability
                  </label>
                  <input
                    :disabled="isLoading || modalType === 'view'"
                    type="number"
                    v-model.number="form.probability"
                    name="probability"
                    placeholder="Enter the probability of incident"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2" v-if="user?.user_roles?.includes('SPV')">
                <div class="col-span-2 lg:col-span-1">
                  <label
                    for="action_taken"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Action Taken
                  </label>
                  <input
                    :disabled="isLoading || modalType === 'view'"
                    type="text"
                    v-model="form.action_taken"
                    name="action_taken"
                    placeholder="Enter action has/will be taken"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
                <div class="col-span-2 lg:col-span-1">
                  <label
                    for="status"
                    class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                  >
                    Status
                  </label>
                  <select
                    :disabled="isLoading || modalType === 'view'"
                    v-model="form.status"
                    name="status"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    <option value="submitted" v-if="form.status === 'submitted'">Submitted</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  for="evidence"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Evidence<span class="text-error-500">*</span>
                </label>
                <input
                  :disabled="isLoading || ['view', 'review'].includes(modalType)"
                  type="file"
                  @change="handleFiles"
                  multiple
                  name="evidence"
                  placeholder="Enter the evidence of incident"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
              <ul>
                <li v-for="(file, index) in form.attachments" :key="index" class="flex justify-between text-sm py-0.5">
                  <span v-if="file.url">
                    <a :href="file.url" target="_blank">{{ file.name }}</a>
                  </span>
                  <span v-else>
                    {{ file.name }}
                  </span>
                  <button
                    v-if="!['view', 'review'].includes(modalType)"
                    type="button" @click="removeAttachment(index)" class="text-red-500">X</button>
                </li>
                <li v-for="(file, index) in form.old_attachments" :key="index" class="flex justify-between text-sm py-0.5">
                  <span v-if="file.url">
                    <a :href="file.url" target="_blank">{{ file.filename }}</a>
                  </span>
                  <span v-else>
                    {{ file.filename }}
                  </span>
                  <button
                    v-if="!['view', 'review'].includes(modalType)"
                    type="button" @click="removeOldAttachment(index)" class="text-red-500">X</button>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <button
              :disabled="isLoading"
              @click="isModalReportOpen = false"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              v-if="['create', 'edit'].includes(modalType)"
              :disabled="isLoading"
              @click="submitReport('draft')"
              type="button"
              class="flex w-full justify-center rounded-lg bg-success-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-600 sm:w-auto"
            >
                <span
                  v-if="isLoading"
                  class="mr-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
                ></span>
              Draft
            </button>
            <button
              v-if="modalType !== 'view'"
              :disabled="isLoading"
              @click="submitReport('submitted')"
              type="button"
              class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
                <span
                  v-if="isLoading"
                  class="mr-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
                ></span>
              Submit
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ReportTable from '@/components/report/ReportTable.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Modal from '@/components/common/Modal.vue'
import type { ReportInterface } from '@/interfaces/ReportInterface.ts'
import { useReportStore } from '@/stores/report.ts'
import { showToast } from '@/plugins/Toast.ts'
import { confirmModal } from '@/plugins/confirmModal.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { storeToRefs } from 'pinia'

const getDefaultFormValues = (): ReportInterface => ({
  location: '',
  description: '',
  category: null,
  severity: null,
  probability: null,
  action_taken: null,
  status: null,
  attachments: [],
  old_attachments: []
})

const form = reactive<ReportInterface>(getDefaultFormValues())
const modal = ref({
  title: 'Create Report',
  description: 'Fill the report form',
})
const isModalReportOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const modalType = ref('create')

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const reportStore = useReportStore()

const handleFiles = (e): void => {
  form.attachments = Array.from(e.target.files);
};

const removeAttachment = (index: number) => {
  form.attachments.splice(index, 1)
};

const removeOldAttachment = (index: number) => {
  form.old_attachments.splice(index, 1)
};

const submitReport = (status: string = 'draft') => {
  if (modalType.value !== 'review') {
    form.status = status
  }

  const data = new FormData()
  data.append('location', form.location)
  data.append('category', form.category)
  data.append('description', form.description)
  data.append('severity', form.severity ?? 0)
  data.append('probability', form.probability ?? 0)
  data.append('status', form.status);
  data.append('action_taken', form.action_taken)

  form.attachments.forEach(file => {
    data.append('attachments[]', file)
  });

  data.append('old_attachments', JSON.stringify(form.old_attachments))

  isLoading.value = true;
  if (['edit', 'review'].includes(modalType.value)) {
    updateReport(data, form.id)
  } else {
    storeReport(data)
  }
}

const storeReport = (data): void => {
  reportStore
    .createReport(data)
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
        // reset form value
        resetForm()
        isModalReportOpen.value = false
      } else {
        showToast({title: res.message, icon: 'error'})
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed store new report!'
      showToast({ title: errorMessage, icon: 'error' })
    })
    .finally(() => {
      isLoading.value = false
    })
}

const updateReport = (data, id: number): void => {
  data.append('_method', 'put')
  reportStore
    .updateReport(id, data)
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
        // reset form value
        resetForm()
        isModalReportOpen.value = false
      } else {
        showToast({title: res.message, icon: 'error'})
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to update report!'
      showToast({ title: errorMessage, icon: 'error' })
    })
    .finally(() => {
      isLoading.value = false
    })
}

const openModal = (id: number, type: string) => {
  reportStore
    .fetchReport(id)
    .then(res => {
      if (res.status === 'success') {
        isModalReportOpen.value = true
        modalType.value = type

        if (type === 'edit') {
          modal.value.title = 'Edit Report'
        } else if (type === 'review') {
          modal.value.title = 'Review Report'
        } else {
          modal.value.title = 'View Report Detail'
        }

        setModalData(res.data)
      } else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to get detail report!'
      showToast({ title: errorMessage, icon: 'error' })
    })
}

const resetForm = () => {
  Object.assign(form, getDefaultFormValues())
  modal.value.title = 'Create Report'
  modalType.value = 'create'
}

const setModalData = (data: ReportInterface) => {
  form.id = data.id
  form.location = data.location
  form.category = data.category
  form.description = data.description
  form.status = data.status
  form.severity = data.severity ?? 0
  form.probability = data.probability ?? 0
  form.action_taken = data.action_taken
  form.old_attachments = data.attachments ?? []
  form.attachments = []
}

const deleteReport = (id: number) => {
  const confirmed = confirmModal({
    title: 'Are you sure you want to delete this Report?'
  })

  confirmed
    .then(isConfirm => {
      if (isConfirm) {
        reportStore
          .deleteReport(id)
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
    })
}

watch(isModalReportOpen, (val) => {
  if (!val) resetForm()
})
</script>
