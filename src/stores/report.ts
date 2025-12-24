import { defineStore } from 'pinia'
import { storeReportApi, fetchReportsApi, fetchReportDetailApi, deleteReportApi, updateReportApi } from '@/services/report.api.ts'
import type { ReportInterface } from '@/interfaces/ReportInterface.ts'
import type { PaginationInterface } from '@/interfaces/PaginationInterface.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [] as ReportInterface[],
    pagination: {} as PaginationInterface<ReportInterface[]>
  }),
  actions: {
    async createReport(payload: ReportInterface): Promise<ApiResponseInterface<ReportInterface>> {
      try {
        const response = await storeReportApi(payload)
        if (response.status === 'success') {
          this.reports.push(response.data as ReportInterface)
        }
        return response
      } catch (error) {
        throw error
      }
    },
    async fetchReports(payload: { search: null|string, page: number }): Promise<void> {
      try {
        const response = await fetchReportsApi(payload)
        if (response.status === 'success') {
          const data = response.data as PaginationInterface<ReportInterface[]>

          this.pagination.from = data.from
          this.pagination.to = data.to
          this.pagination.total = data?.total ?? 0
          this.pagination.per_page = data?.per_page ?? 15
          this.reports = data.data
        }
      } catch (error) {
        throw error
      }
    },
    async fetchReport(reportId: number): Promise<ApiResponseInterface<ReportInterface>> {
      try {
        return await fetchReportDetailApi(reportId)
      } catch (error) {
        throw error
      }
    },
    async deleteReport(reportId: number): Promise<ApiResponseInterface<null>> {
      try {
        const response = await deleteReportApi(reportId)
        if (response.status === 'success') {
          await this.fetchReports({search: '', page: 1})
        }
        return response
      } catch (error) {
        throw error
      }
    },
    async updateReport(id: number, payload: ReportInterface): Promise<ApiResponseInterface<ReportInterface>> {
      try {
        const response = await updateReportApi(id, payload)
        if (response.status === 'success') {
            await this.fetchReports({search: '', page: 1})
        }
        return response
      } catch (error) {
        throw error
      }
    }
  }
})
