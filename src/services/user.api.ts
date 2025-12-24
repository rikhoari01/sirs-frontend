import type { UserInterface } from '@/interfaces/UserInterface.ts'
import api from '@/services/api.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import type { PaginationInterface } from '@/interfaces/PaginationInterface.ts'

export const updateUserApi = async (
  payload: UserInterface
): Promise<ApiResponseInterface<UserInterface>> => {
  const { data } = await api.put(`/user/${payload.id}`, payload)
  return data
}

export const fetchUsersApi = async (payload: { page: number, search: string }): Promise<ApiResponseInterface<PaginationInterface<UserInterface[]>>> => {
  const { data } = await api.get('user', {
    params: payload,
  })
  return data
}
