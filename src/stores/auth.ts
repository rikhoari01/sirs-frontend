import { defineStore } from 'pinia'
import type { LoginResponse, LoginResponseInterface } from '@/interfaces/LoginResponseInterface'
import type { LoginDataInterface } from '@/interfaces/LoginDataInterface'
import type { UserInterface } from '@/interfaces/UserInterface'
import type { ResetPasswordDataInterface } from '@/interfaces/ResetPasswordDataInterface.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'
import {
  loginApi,
  logoutApi,
  profileApi,
  registerApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
} from '@/services/auth.api'

export const useAuthStore = defineStore('auth', {
  state: (): LoginResponse => ({
    token: localStorage.getItem('token'),
    user: {} as UserInterface
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token
  },

  actions: {
    setAuth(response: LoginResponse) {
      this.token = response.token
      this.user = response.user
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
    },

    setUser(data: UserInterface) {
      this.user = data
    },

    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    async login(credentials: LoginDataInterface): Promise<LoginResponseInterface> {
      try {
        const response = await loginApi(credentials)

        if (response.status === 'success') {
          this.setAuth(response.data)
        } else {
          this.clearAuth()
        }

        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async register(payload: UserInterface): Promise<ApiResponseInterface<UserInterface>> {
      try {
        return await registerApi(payload)
      } catch (error) {
        throw error
      }
    },

    async profile(): Promise<ApiResponseInterface<UserInterface>> {
      try {
        const response = await profileApi()

        if (response.status === 'success') {
          this.setUser(response.data)
        } else {
          this.clearAuth()
        }
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async logout(): Promise<ApiResponseInterface<null>> {
      try {
        const response = await logoutApi()
        if (response.status === 'success') {
          this.clearAuth()
        }
        return response
      } catch (error) {
        throw error
      }
    },

    async forgotPassword(payload: { email: string }): Promise<ApiResponseInterface<null>> {
      try {
        return  await forgotPasswordApi(payload)
      } catch (error) {
        throw error
      }
    },

    async resetPassword(payload: ResetPasswordDataInterface): Promise<ApiResponseInterface<null>> {
      try {
        return await resetPasswordApi(payload)
      } catch (error) {
        throw error
      }
    },

    async verifyEmail(payload: { email: string, hash: string }): Promise<ApiResponseInterface<null>> {
      try {
        return await verifyEmailApi(payload)
      } catch (error) {
        throw error
      }
    }
  }
})
