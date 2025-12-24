<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'Role Management'" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Role List">
        <template #button>
          <button
            @click="isModalRoleOpen = true"
            type="button"
            class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            Add Role
          </button>
        </template>
        <RoleManagementTable @delete-role="deleteRole" @open-modal="openModal" />
      </ComponentCard>
    </div>
  </AdminLayout>

  <Modal v-if="isModalRoleOpen" @close="isModalRoleOpen = false">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
      >
        <!-- close btn -->
        <button
          @click="isModalRoleOpen = false"
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
              <div>
                <label
                  for="name"
                  class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                >
                  Name<span class="text-error-500">*</span>
                </label>
                <input
                  :disabled="isLoading || modal.type === 'view'"
                  v-model="name"
                  type="text"
                  multiple
                  name="name"
                  placeholder="Enter role name"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <button
              :disabled="isLoading"
              @click="isModalRoleOpen = false"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              v-if="modal.type !== 'view'"
              :disabled="isLoading"
              @click="saveRole"
              type="button"
              class="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
                <span
                  v-if="isLoading"
                  class="mr-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"
                ></span>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import RoleManagementTable from '@/components/role-management/RoleManagementTable.vue'
import Modal from '@/components/common/Modal.vue'
import { showToast } from '@/plugins/Toast.ts'
import { useRoleStore } from '@/stores/role.ts'
import { confirmModal } from '@/plugins/confirmModal.ts'

const name = ref('')
const roleId = ref(0)
const isModalRoleOpen = ref(false)
const isLoading = ref(false)
const modal = ref({
  type: 'create',
  title: 'Create Role',
  description: 'Fill the role information',
})

const roleStore = useRoleStore()

const saveRole = () => {
  isLoading.value = true
  if (modal.value.type === 'create') {
    storeRole()
  } else {
    updateRole()
  }
}

const storeRole = () => {
  roleStore
    .createRole({name: name.value})
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
      } else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to create role!'
      showToast({ title: errorMessage, icon: 'error' })
    })
    .finally(() => {
      isLoading.value = false
      isModalRoleOpen.value = false
    })
}

const updateRole = () => {
  roleStore
    .updateRole(roleId.value, {name: name.value})
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
      } else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      const errorMessage = err.response?.data?.message || 'Failed to create role!'
      showToast({ title: errorMessage, icon: 'error' })
    })
    .finally(() => {
      isLoading.value = false
      isModalRoleOpen.value = false
    })
}

const openModal = (id: number) => {
  roleStore
    .fetchRole(id)
    .then(res => {
      if (res.status === 'success') {
        name.value = res.data.name
        roleId.value = res.data.id
        isModalRoleOpen.value = true
        modal.value.type = 'update'
      } else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      showToast({ title: err.response?.data?.message || 'Failed to create role!', icon: 'error' })
    })
}

const deleteRole = (id: number) => {
  const confirmed = confirmModal({
    title: 'Are you sure you want to delete this Role?'
  })

  confirmed
    .then(isConfirm => {
      if (isConfirm) {
        roleStore
          .deleteRole(id)
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

watch(isModalRoleOpen, (val) => {
  if (!val) {
    name.value = ''
    roleId.value = 0
  }
})
</script>
