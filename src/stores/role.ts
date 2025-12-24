import { defineStore } from 'pinia'
import type { PaginationInterface } from '@/interfaces/PaginationInterface.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import {
  assignRoleApi,
  deleteRoleApi,
  fetchRoleDetailApi,
  fetchRolesApi,
  storeRoleApi,
  updateRolesApi
} from '@/services/role.api.ts'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [] as {name: string}[],
    pagination: {} as PaginationInterface<{name: string}[]>
  }),
  actions: {
    async createRole(payload: { name: string }): Promise<ApiResponseInterface<never>> {
      try {
        const response = await storeRoleApi(payload)
        if (response.status === 'success') {
          this.roles.push(response.data)
        }
        return response
      } catch (error) {
        throw error
      }
    },
    async fetchRoles(payload: { page: number, search: string }): Promise<ApiResponseInterface<PaginationInterface<never>>> {
      try {
        const response = await fetchRolesApi(payload)
        if (response.status === 'success') {
          const data = response.data as PaginationInterface<never>

          this.pagination.from = data.from
          this.pagination.to = data.to
          this.pagination.total = data?.total ?? 0
          this.pagination.per_page = data?.per_page ?? 15
          this.roles = data.data
        }
        return response
      } catch (error) {
        throw error
      }
    },
    async fetchRole(roleId: number): Promise<ApiResponseInterface<never>> {
      try {
        return await fetchRoleDetailApi(roleId)
      } catch (error) {
        throw error
      }
    },
    async deleteRole(reportId: number): Promise<ApiResponseInterface<null>> {
      try {
        const response = await deleteRoleApi(reportId)
        if (response.status === 'success') {
          await this.fetchRoles({page: 1, search: ''})
        }
        return response
      } catch (error) {
        throw error
      }
    },
    async updateRole(id: number, payload: { name: string }): Promise<ApiResponseInterface<never>> {
      try {
        const response = await updateRolesApi(id, payload)
        if (response.status === 'success') {
          await this.fetchRoles({page: 1, search: ''})
        }
        return response
      } catch (error) {
        throw error
      }
    },
    async assignRole(payload: { user_id: number, role_names: string[] }): Promise<ApiResponseInterface<never>> {
      try {
        const response = await assignRoleApi(payload)
        if (response.status === 'success') {
          await this.fetchRoles({page: 1, search: ''})
        }
        return response
      } catch (error) {
        throw error
      }
    }
  }
})
