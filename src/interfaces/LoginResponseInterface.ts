import type { UserInterface } from '@/interfaces/UserInterface.ts'
import type { ApiResponseInterface } from '@/interfaces/ApiResponseInterface.ts'

export interface LoginResponse {
  token: null | string;
  user: null | UserInterface
}

export type LoginResponseInterface = ApiResponseInterface<LoginResponse>
