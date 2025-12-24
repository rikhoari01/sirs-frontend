import { defineStore } from 'pinia'
import type { UserInterface } from '@/interfaces/UserInterface.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import type { PaginationInterface } from '@/interfaces/PaginationInterface'
import { fetchUsersApi, updateUserApi } from '@/services/user.api.ts'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as UserInterface[],
    pagination: {} as PaginationInterface<UserInterface[]>,
  }),
  actions: {
    async updateUser(payload: UserInterface): Promise<ApiResponseInterface<UserInterface>> {
      try {
        return await updateUserApi(payload)
      } catch (error) {
        throw error
      }
    },
    async fetchUsers(payload: { page: number, search: string}): Promise<ApiResponseInterface<PaginationInterface<UserInterface[]>>> {
      try {
        const response = await fetchUsersApi(payload)
        if (response.status === 'success') {
          const data = response.data as PaginationInterface<UserInterface[]>

          this.pagination.from = data.from
          this.pagination.to = data.to
          this.pagination.total = data?.total ?? 0
          this.pagination.per_page = data?.per_page ?? 15
          this.users = data.data
        }
        return response
      } catch (error) {
        throw error
      }
    }
  }
})
