import api from '@/services/api.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import type { ReportInterface } from '@/interfaces/ReportInterface.ts'
import type { PaginationInterface } from '@/interfaces/PaginationInterface.ts'

export const storeReportApi = async (payload: ReportInterface): Promise<ApiResponseInterface<ReportInterface>> => {
  const { data } = await api.post('/report', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  return data
}

export const fetchReportsApi = async (payload: { search: null|string, page: number }): Promise<ApiResponseInterface<PaginationInterface<ReportInterface[]>>> => {
  const { data } = await api.get('/report', {
    params: payload
  })
  return data
}

export const fetchReportDetailApi = async (reportId: number): Promise<ApiResponseInterface<ReportInterface>> => {
  const { data } = await api.get('/report/' + reportId)
  return data
}

export const deleteReportApi = async (reportId: number): Promise<ApiResponseInterface<null>> => {
  const { data } = await api.delete('/report/' + reportId)
  return data
}

export const updateReportApi = async (id: number, payload: ReportInterface): Promise<ApiResponseInterface<ReportInterface>> => {
  const { data } = await api.post(`/report/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  return data
}
