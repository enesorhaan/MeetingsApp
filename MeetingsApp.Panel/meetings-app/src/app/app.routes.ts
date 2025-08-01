import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'meeting-form', 
    loadComponent: () => import('./components/meeting-form/meeting-form').then(m => m.MeetingFormComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
