import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {LoginComponent} from './auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {path: 'user', component: MainLayoutComponent, canActivate: [authGuard], children: [
    {path: 'dashboard', component: DashboardComponent}
  ]},
  {path: 'auth', component: AuthLayoutComponent, canActivate: [noAuthGuard], children: [
    {path: 'login', component: LoginComponent}
  ]},
  {path:'**', redirectTo: 'auth/login'}
];
