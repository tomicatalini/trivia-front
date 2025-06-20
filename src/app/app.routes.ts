import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'home',
        canActivate: [authGuard],
        loadChildren: () => import('./core/routes/home.routes').then(m => m.HOME_ROUTES)
    },
    { path: '**', redirectTo: 'login' },
];
