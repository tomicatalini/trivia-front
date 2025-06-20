import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.service.validateUser(
      this.loginForm.value.username,
      this.loginForm.value.password
    ).subscribe({
      next: (response: any) => {
        this.service.login(response.result);
        this.router.navigate(['/home']); 
      },
      error: (error) => {
        console.error("Error validating user", error);
      }
    });
  }
}
