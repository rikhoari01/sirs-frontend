export interface ApiResponseInterface<T> {
  status: 'success' | 'failed',
  message: string,
  data: T
}
