import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarItemInterface } from '../../interfaces/sidebar-item.interface';
import {UsuariosService} from '../../services/usuarios.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarItems: SidebarItemInterface[] = [];

  constructor(private usuariosService: UsuariosService) {
    this.sidebarItems = [
      { title: 'Dashboard', icon: 'dashboard', link: '/user/dashboard', isAllowed: true },
      { title: 'Empleados', icon: 'badge', link: '/user/empleados-table', isAllowed: usuariosService.hasPermission('ACCESO_EMPLEADOS') },
      { title: 'Clientes', icon: 'people', link: '/user/clientes-table', isAllowed: usuariosService.hasPermission('ACCESO_CLIENTES') },
      { title: 'Ventas', icon: 'shopping_cart',
        isAllowed: usuariosService.hasPermission('ACCESO_PRESUPUESTOS') || usuariosService.hasPermission('ACCESO_FACTURAS'),
        children: [
          { title: 'Presupuestos', link: '/user/ventas/presupuestos-table', isAllowed: usuariosService.hasPermission('ACCESO_PRESUPUESTOS') },
          { title: 'Pedidos', link: '/user/ventas/pedidos-table', isAllowed: usuariosService.hasPermission('ACCESO_PEDIDOS') },
          { title: 'Facturas', link: '/user/ventas/facturas-table', isAllowed: usuariosService.hasPermission('ACCESO_FACTURAS') },
        ]},
      { title: 'Proveedores', icon: 'local_shipping',
        isAllowed: usuariosService.hasPermission('ACCESO_PROVEEDORES') || usuariosService.hasPermission('ACCESO_PEDIDOS_PROVEEDORES'),
        children: [
          { title: 'Proveedores', link: '/user/proveedores/proveedores-table', isAllowed: usuariosService.hasPermission('ACCESO_PROVEEDORES') },
          { title: 'Pedidos', link: '/user/proveedores/pedidos-proveedores-table', isAllowed: usuariosService.hasPermission('ACCESO_PEDIDOS_PROVEEDORES') },
        ]
      },
      { title: 'Inventario', icon: 'store',
        isAllowed: usuariosService.hasPermission('ACCESO_PRODUCTOS') || usuariosService.hasPermission('ACCESO_CATEGORIAS'),
        children: [
          { title: 'Productos', link: '/user/inventario/productos-view', isAllowed: usuariosService.hasPermission('ACCESO_PRODUCTOS') },
          { title: 'Categorías', link: '/user/inventario/categorias-productos-table', isAllowed: usuariosService.hasPermission('ACCESO_CATEGORIAS_PRODUCTOS') },
        ]
      },
      { title: 'Roles', link: '/user/roles-table', icon: 'admin_panel_settings', isAllowed: usuariosService.hasPermission('ACCESO_ROLES') },
    ]
  }

  dropdownStates: { [key: string]: boolean } = {};


  toggleDropdownState(title: string) {
    this.dropdownStates[title] = !this.dropdownStates[title];
  }

}
