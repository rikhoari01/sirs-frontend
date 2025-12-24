<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="'User Management'" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="User List">
        <UserManagementTable @open-modal="openModal" />
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
            Assign Role
          </h4>
          <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Assign Role to User
          </p>
        </div>
        <form class="flex flex-col">
          <div class="custom-scrollbar overflow-y-auto p-2">
            <div class="space-y-5">
              <div class="flex items-center mb-4" v-for="(role, index) in roles" :key="index">
                <input :id="'roles-'+index" v-model="rolesModel" type="checkbox" name="roles[]" :value="role.name" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
                <label :for="'roles-'+index" class="select-none ms-2 text-sm font-medium text-heading">{{ role.name }}</label>
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
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import UserManagementTable from '@/components/user-management/UserManagementTable.vue'
import Modal from '@/components/common/Modal.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoleStore } from '@/stores/role.ts'
import { useUserStore } from '@/stores/user.ts'
import { showToast } from '@/plugins/Toast.ts'

const isLoading = ref(false)
const isModalRoleOpen = ref(false)
const rolesModel = ref<string[]>([])
const roles = ref<string[]>([])
const userId = ref(0)

const userStore = useUserStore()
const roleStore = useRoleStore()

const fetchRoles = () => {
  roleStore
    .fetchRoles({page: 1, search: ''})
    .then(res => {
      if (res.status === 'success') {
        res.data.data.forEach((role) => {
          roles.value.push(role)
        })
      }
    })
}

const saveRole = () => {
  isLoading.value = true
  roleStore
    .assignRole({ user_id: userId.value, role_names: rolesModel.value })
    .then(res => {
      if (res.status === 'success') {
        showToast({title: res.message})
        userStore.fetchUsers({page: 1, search: ''})
      } else {
        throw new Error(res.message)
      }
    })
    .catch(err => {
      showToast({ title: err.response?.data?.message || 'Failed to assign role!', icon: 'error' })
    })
    .finally(() => {
      isLoading.value = false
      rolesModel.value = []
      userId.value = 0
      isModalRoleOpen.value = false
    })
}

const openModal = (id) => {
  const userData = userStore.users.find(user => user.id === id)
  rolesModel.value = userData.user_roles ?? []
  isModalRoleOpen.value = true
  userId.value = id
}

onMounted(() => fetchRoles())
</script>
