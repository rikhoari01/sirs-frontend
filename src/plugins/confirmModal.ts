import Swal from 'sweetalert2'

export interface ConfirmOptions {
  title: string
  text?: string
  icon?: 'warning' | 'question' | 'info' | 'error'
  confirmButtonText?: string
  cancelButtonText?: string
}

export const confirmModal = async (
  {
    title,
    text,
    icon = 'warning',
    confirmButtonText = 'Yes',
    cancelButtonText = 'Cancel',
  }: ConfirmOptions
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  })

  return result.isConfirmed
}
