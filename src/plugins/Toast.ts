import Swal from 'sweetalert2'
import type { ToastOptionsInterface } from '@/interfaces/ToastOptionsInterface.ts'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export const showToast = (
  {title, icon = 'success', timer = 1500}: ToastOptionsInterface
): void => {
  Toast.fire({
    title,
    icon,
    timer
  })
}
