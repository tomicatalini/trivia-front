import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  standalone: true,
})
export class RegisterComponent {

  registerForm : FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onRegister(){
    console.log("Registering user", this.registerForm.value);

    this.service.registerUser(
      this.registerForm.value.username,
      this.registerForm.value.password,
      this.registerForm.value.email,
      this.registerForm.value.role
    ).subscribe({
      next: (response) => {
        console.log("User registered successfully", response);   
      },
      error: (error) => {
        console.error("Error registering user", error);
      }
    });
  }
}
