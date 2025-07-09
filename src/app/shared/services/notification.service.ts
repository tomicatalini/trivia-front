import { Injectable } from "@angular/core"
import Swal from "sweetalert2"

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  showSuccessToast(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: "success",
      title: title,
      text: text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#f0f9ff",
      color: "#1e40af",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer)
        toast.addEventListener("mouseleave", Swal.resumeTimer)
      },
    })
  }

  showErrorToast(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: "error",
      title: title,
      text: text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#fef2f2",
      color: "#dc2626",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer)
        toast.addEventListener("mouseleave", Swal.resumeTimer)
      },
    })
  }

  showWarningToast(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: "warning",
      title: title,
      text: text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#fffbeb",
      color: "#d97706",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer)
        toast.addEventListener("mouseleave", Swal.resumeTimer)
      },
    })
  }

  showInfoToast(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: "info",
      title: title,
      text: text,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#f0f9ff",
      color: "#2563eb",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer)
        toast.addEventListener("mouseleave", Swal.resumeTimer)
      },
    })
  }

  // Método para confirmaciones
  showConfirmDialog(title: string, text: string, confirmButtonText = "Sí, confirmar"): Promise<any> {
    return Swal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Cancelar",
    })
  }
}

