import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import api from '@/services/api.ts'

export const fetchDashboardApi = async (period: string): Promise<ApiResponseInterface<[]>> => {
  const { data } = await  api.get('dashboard', {
    params: { period: period },
  })
  return data
}
