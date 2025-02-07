import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {LoginComponent} from './auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import {ClientesTableComponent} from './pages/clientes/clientes-table/clientes-table.component';

export const routes: Routes = [
  {path: 'user', component: MainLayoutComponent, canActivate: [authGuard], children: [
    {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
    {path: 'clientes-table', component: ClientesTableComponent, data: {title: 'Clientes'}},
  ]},
  {path: 'auth', component: AuthLayoutComponent, canActivate: [noAuthGuard], children: [
    {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  ]},
  {path:'**', redirectTo: 'auth/login'}
];
