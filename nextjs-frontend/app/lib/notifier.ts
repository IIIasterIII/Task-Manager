import { toast } from "sonner"

interface UniversalResponse {
  success?: boolean
  data?: any
  error?: string
  detail?: string | any[]
  status?: number
  [key: string]: any 
}

/**
 * Universal notifier for Server Actions
 * @param res - Response from the server action
 * @param successMessage - Optional custom message for success
 */

export const notify = (res: UniversalResponse, successMessage?: string): boolean => {
  const isSuccessful = res?.success === true || (res && !res.error && !res.detail)

  if (isSuccessful) {
    if (successMessage) {
      toast.success(successMessage)
    }
    return true
  }

  let errorMessage = "An unexpected error occurred"

  if (res?.error) {
    errorMessage = res.error
  } else if (res?.detail) {
    errorMessage = typeof res.detail === 'string' ? res.detail : "Validation error"
  }

  const status = res?.status

  if (status === 401 || errorMessage.toLowerCase().includes("unauthorized")) {
    toast.error("Session expired. Please log in again", {
      description: "You will be redirected to the login page."
    })
  } else if (status === 404) {
    toast.error("Resource not found", { description: errorMessage })
  } else if (status === 500 || errorMessage.toLowerCase().includes("server error")) {
    toast.error("Server Error", { description: "We're having trouble on our end. Please try later." })
  } else {
    toast.error("Error", { description: errorMessage })
  }

  return false
}