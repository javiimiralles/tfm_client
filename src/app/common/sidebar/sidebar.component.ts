import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarItemInterface } from '../../interfaces/sidebar-item-interface';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarItems: SidebarItemInterface[] = [
    {  title: 'Dashboard', icon: 'dashboard', link: '/user/dashboard' },
    { title: 'Clientes', icon: 'people', link: '/user/clientes-table' },
    { title: 'Ventas', icon: 'shopping_cart', children: [
      { title: 'Presupuestos', link: '/user/ventas/presupuestos' },
      { title: 'Facturas', link: '/user/ventas/facturas' },
    ]},
    { title: 'Proveedores', icon: 'local_shipping', link: '/user/proveedores' },
    { title: 'Inventario', icon: 'store', children: [
      { title: 'Productos', link: '/user/inventario/productos' },
      { title: 'Categorías', link: '/user/inventario/categorias' },
    ]}
  ];

  dropdownStates: { [key: string]: boolean } = {};

  constructor() { }

  toggleDropdownState(title: string) {
    this.dropdownStates[title] = !this.dropdownStates[title];
  }

}
