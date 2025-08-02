import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { MeetingFormComponent } from './components/meeting-form/meeting-form';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { JoinMeetingComponent } from './components/join-meeting/join-meeting';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'meeting-form', component: MeetingFormComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'meeting/join/:guid', component: JoinMeetingComponent },
  { path: '**', redirectTo: '/login' }
];
