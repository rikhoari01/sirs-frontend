import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import type { PaginationInterface } from '@/interfaces/PaginationInterface.ts'
import api from '@/services/api.ts'

export const fetchRolesApi = async  (payload: {page: number, search: string}): Promise<ApiResponseInterface<PaginationInterface<never>>> => {
  const { data } = await api.get('/role', {
    params: payload,
  })
  return data
}

export const fetchRoleDetailApi = async  (roleId: number): Promise<ApiResponseInterface<never>> => {
  const { data } = await api.get(`/role/${roleId}`)
  return data
}

export const storeRoleApi = async (payload: { name: string }): Promise<ApiResponseInterface<never>> => {
  const { data } = await api.post('/role', payload)
  return data
}

export const deleteRoleApi = async  (roleId: number): Promise<ApiResponseInterface<null>> => {
  const { data } = await api.delete(`/role/${roleId}`)
  return data
}

export const updateRolesApi = async  (roleId: number, payload: { name: string }): Promise<ApiResponseInterface<never>> => {
  const { data } = await api.put(`/role/${roleId}`, payload)
  return data
}

export const assignRoleApi = async (payload: { user_id: number, role_names: string[] }): Promise<ApiResponseInterface<never>> => {
  const { data } = await api.post('/role/assign', payload)
  return data
}
