import { defineStore } from 'pinia'
import { fetchDashboardApi } from '@/services/dashboar.api.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    options: ['Weekly', 'Monthly', 'Yearly'],
    selectedOptions: 'Weekly',
    data: []
  }),
  actions: {
    async getDashboard(): Promise<ApiResponseInterface<[]>> {
      try {
        const response = await fetchDashboardApi(this.selectedOptions)
        if (response.status === 'success') {
          this.data = response.data
        }
        return response
      } catch (error) {
        throw error
      }
    }
  }
})
