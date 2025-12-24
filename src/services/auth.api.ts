import api from '@/services/api'
import type { LoginDataInterface } from '@/interfaces/LoginDataInterface'
import type { LoginResponseInterface } from '@/interfaces/LoginResponseInterface'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import type { UserInterface } from '@/interfaces/UserInterface.ts'
import type { ResetPasswordDataInterface } from '@/interfaces/ResetPasswordDataInterface.ts'

export const loginApi = async (
  credentials: LoginDataInterface
): Promise<LoginResponseInterface> => {
  const { data } = await api.post<LoginResponseInterface>(
    '/auth/login',
    credentials
  )
  return data
}

export const registerApi = async (
  payload: UserInterface
): Promise<ApiResponseInterface<UserInterface>> => {
  const { data } = await api.post('auth/register', payload)
  return data
}

export const profileApi = async (): Promise<ApiResponseInterface<UserInterface>> => {
  const { data } = await api.get('/auth/me')
  return data
}

export const logoutApi = async (): Promise<ApiResponseInterface<null>> => {
  const { data } = await api.post('/auth/logout')
  return data;
}

export const forgotPasswordApi = async (payload: { email: string }): Promise<ApiResponseInterface<null>> => {
  const { data } = await api.post('/auth/forgot-password', payload)
  return data
}

export const resetPasswordApi = async (payload: ResetPasswordDataInterface): Promise<ApiResponseInterface<null>> => {
  const { data } = await api.post('/auth/reset-password', payload)
  return data
}

export const verifyEmailApi = async (payload: { email: string, hash: string }): Promise<ApiResponseInterface<null>> => {
  const { data } = await api.post('/auth/verify-email', payload)
  return data
}
