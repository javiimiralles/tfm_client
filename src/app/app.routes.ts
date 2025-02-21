import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {LoginComponent} from './auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import {ClientesTableComponent} from './pages/clientes/clientes-table/clientes-table.component';
import {ClienteFormComponent} from './pages/clientes/cliente-form/cliente-form.component';
import {EmpleadosTableComponent} from './pages/empleados/empleados-table/empleados-table.component';
import {EmpleadoFormComponent} from './pages/empleados/empleado-form/empleado-form.component';
import {ProductosViewComponent} from './pages/inventario/productos/productos-view/productos-view.component';
import {ProductoFormComponent} from './pages/inventario/productos/producto-form/producto-form.component';
import {CategoriasProductosTableComponent} from './pages/inventario/categorias/categorias-productos-table/categorias-productos-table.component';

export const routes: Routes = [
  {path: 'user', component: MainLayoutComponent, canActivate: [authGuard], children: [
    {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
    {path: 'empleados-table', component: EmpleadosTableComponent, data: {title: 'Empleados'}},
    {path: 'empleado-form/:id', component: EmpleadoFormComponent, data: {title: 'Empleado'}},
    {path: 'clientes-table', component: ClientesTableComponent, data: {title: 'Clientes'}},
    {path: 'cliente-form/:id', component: ClienteFormComponent, data: {title: 'Cliente'}},
    {path: 'inventario/productos/productos-view', component: ProductosViewComponent, data: {title: 'Productos'}},
    {path: 'inventario/productos/producto-form/:id', component: ProductoFormComponent, data: {title: 'Producto'}},
    {path: 'inventario/categorias/categorias-productos-table', component: CategoriasProductosTableComponent, data: {title: 'Categorías de productos'}},
  ]},
  {path: 'auth', component: AuthLayoutComponent, canActivate: [noAuthGuard], children: [
    {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  ]},
  {path:'**', redirectTo: 'auth/login'}
];
