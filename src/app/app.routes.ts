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
import {ProveedoresTableComponent} from './pages/proveedores/proveedores/proveedores-table/proveedores-table.component';
import {ProveedorFormComponent} from './pages/proveedores/proveedores/proveedor-form/proveedor-form.component';
import {CestaComponent} from './pages/cesta/cesta.component';
import {
  PedidosProveedoresTableComponent
} from './pages/proveedores/pedidos/pedidos-proveedores-table/pedidos-proveedores-table.component';
import {
  PedidoProveedorDetailsComponent
} from './pages/proveedores/pedidos/pedido-proveedor-details/pedido-proveedor-details.component';
import {RolesTableComponent} from './pages/roles/roles-table/roles-table.component';
import {RolFormComponent} from './pages/roles/rol-form/rol-form.component';
import {PresupuestosTableComponent} from './pages/ventas/presupuestos/presupuestos-table/presupuestos-table.component';
import {PedidosTableComponent} from './pages/ventas/pedidos/pedidos-table/pedidos-table.component';
import {FacturasTableComponent} from './pages/ventas/facturas/facturas-table/facturas-table.component';
import {PresupuestoFormComponent} from './pages/ventas/presupuestos/presupuesto-form/presupuesto-form.component';
import {PedidoDetailsComponent} from './pages/ventas/pedidos/pedido-details/pedido-details.component';

export const routes: Routes = [
  {path: 'user', component: MainLayoutComponent, canActivate: [authGuard], children: [
      // Dashboard
    {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},
      // Empleados
    {path: 'empleados-table', component: EmpleadosTableComponent, data: {title: 'Empleados'}},
    {path: 'empleado-form/:id', component: EmpleadoFormComponent, data: {title: 'Empleado'}},
      // Clientes
    {path: 'clientes-table', component: ClientesTableComponent, data: {title: 'Clientes'}},
    {path: 'cliente-form/:id', component: ClienteFormComponent, data: {title: 'Cliente'}},
      // Ventas
    {path: 'ventas/presupuestos-table', component: PresupuestosTableComponent, data: {title: 'Presupuestos'}},
    {path: 'ventas/presupuesto-form/:id', component: PresupuestoFormComponent, data: {title: 'Presupuesto'}},
    {path: 'ventas/pedidos-table', component: PedidosTableComponent, data: {title: 'Pedidos'}},
    {path: 'ventas/pedido-details/:id', component: PedidoDetailsComponent, data: {title: 'Detalles del pedido'}},
    {path: 'ventas/facturas-table', component: FacturasTableComponent, data: {title: 'Facturas'}},
      // Proveedores
    {path: 'proveedores/proveedores-table', component: ProveedoresTableComponent, data: {title: 'Proveedores'}},
    {path: 'proveedores/proveedor-form/:id', component: ProveedorFormComponent, data: {title: 'Proveedor'}},
    {path: 'proveedores/pedidos-proveedores-table', component: PedidosProveedoresTableComponent, data: {title: 'Pedidos a proveedores'}},
    {path: 'proveedores/pedido-proveedor-details/:id', component: PedidoProveedorDetailsComponent, data: {title: 'Detalles del pedido'}},
      // Inventario
    {path: 'inventario/productos-view', component: ProductosViewComponent, data: {title: 'Productos'}},
    {path: 'inventario/producto-form/:id', component: ProductoFormComponent, data: {title: 'Producto'}},
    {path: 'inventario/categorias-productos-table', component: CategoriasProductosTableComponent, data: {title: 'Categorías de productos'}},
      // Roles
    {path: 'roles-table', component: RolesTableComponent, data: {title: 'Roles'}},
    {path: 'rol-form/:id', component: RolFormComponent, data: {title: 'Rol'}},
      // Cesta
    {path: 'cesta', component: CestaComponent, data: {title: 'Cesta'}},
  ]},
  // Auth
  {path: 'auth', component: AuthLayoutComponent, canActivate: [noAuthGuard], children: [
    {path: 'login', component: LoginComponent, data: {title: 'Login'}},
  ]},
  {path:'**', redirectTo: 'auth/login'}
];
