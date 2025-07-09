import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  console.log('Interceptor ejecutado');
  // Actualizar última actividad en cada request
  if (authService.isLoggedIn()) {
    authService.extendSession();
  }
  
  return next(req);
};
