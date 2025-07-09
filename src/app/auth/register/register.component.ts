import { Component, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import {
  FormBuilder,
  ReactiveFormsModule,
  type FormGroup,
  Validators,
  type AbstractControl,
  type ValidationErrors,
} from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { NotificationService } from "../../shared/services/notification.service";
import { AuthService } from "../auth.service";
import { catchError, map, tap } from "rxjs";

const ADMINISTRATOR_CODE = "TALLER";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  registerForm: FormGroup
  isSubmitting = signal(false)

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        username: ["", [Validators.required, Validators.minLength(3)]],
        role: ["PLAYER", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        administratorCode: [""],
      },
      { validators:  [this.passwordMatchValidator, this.administratorCodeValidator] },
    )
  }

  // Métodos helper para verificar errores
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.registerForm.get(fieldName)
    if (!field) return false

    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched)
    }
    return field.invalid && (field.dirty || field.touched)
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: "Email",
      username: "Usuario",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      role: "Rol",
    }
    return labels[fieldName] || fieldName
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isSubmitting.set(true)

      // Aquí iría la lógica para enviar los datos al backend
      const formData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        role: this.registerForm.value.role,
      }

      this.authService.registerUser(
        formData.username,
        formData.password,
        formData.email,
        formData.role
      )
      .pipe(
        map(response => response.result),
        catchError((error) => {
          this.isSubmitting.set(false);
          this.notificationService.showErrorToast("Error al registrar usuario", "");
          return [];
        }
      ))
      .subscribe((response) =>{
        this.isSubmitting.set(false);
        this.notificationService.showSuccessToast("Registro exitoso", "Ahora puedes iniciar sesión");
        this.router.navigate(["/auth/login"]);
      });
    }
  }

  get Rol(): string {
    return this.registerForm.get("role")?.value || "USER";
  }

  // ### ERROR MESSAGES ###
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName)
    if (!field || !field.errors) return ""

    const errors = field.errors

    if (errors["required"]) return `${this.getFieldLabel(fieldName)} es requerido`
    if (errors["email"]) return "Ingrese un email válido"
    if (errors["minlength"]) {
      const requiredLength = errors["minlength"].requiredLength
      return `${this.getFieldLabel(fieldName)} debe tener al menos ${requiredLength} caracteres`
    }

    return ""
  }

  getPasswordMismatchError(): string {
    return this.registerForm.hasError("passwordMismatch") && this.registerForm.get("confirmPassword")?.touched
      ? "Las contraseñas no coinciden"
      : "";
  }

  getinvalidAdministratorCodeError(): string {
    return this.registerForm.hasError("invalidAdministratorCode") && this.registerForm.get("administratorCode")?.touched
      ? "Código de administrador inválido"
      : "";
  }  

  // ### VALIDATORS ###  
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password")
    const confirmPassword = control.get("confirmPassword")

    if (!password || !confirmPassword) {
      return null
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true }
  }

  administratorCodeValidator(control: AbstractControl): ValidationErrors | null {
    const administratorCode = control.get("administratorCode");
    const role = control.get("role");

    if (!administratorCode) {
      return null
    }

    if(role && role.value !== "ADMIN") {
      return null;
    }

    return administratorCode.value === ADMINISTRATOR_CODE ? null : { invalidAdministratorCode: true };
  }
}
