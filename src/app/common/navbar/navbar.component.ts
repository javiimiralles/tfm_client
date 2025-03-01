import {Component, HostListener} from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { EmpleadosService } from '../../services/empleados.service';
import {CestaService} from '../../services/cesta.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{

  email: string = '';
  nombre: string = '';
  isDropdownOpen: boolean = false;
  showCesta: boolean = false;
  showCestaIndicator: boolean = false;

  constructor(private usuariosService: UsuariosService, private empleadosService: EmpleadosService, private cestaService: CestaService) {
    this.email = this.usuariosService.email!;
    this.nombre = this.empleadosService.nombre!;

    if (this.usuariosService.hasPermission('ACCESO_PEDIDOS_PROVEEDORES')) {
      this.showCesta = true;
      this.cestaService.cesta$.subscribe(cesta => {
        this.showCestaIndicator = cesta.length > 0;
      });
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  logout() {
    this.usuariosService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.getElementById('dropdown-user');
    if (this.isDropdownOpen && dropdown && !dropdown.contains(target) && !target.closest('button')) {
      this.isDropdownOpen = false;
    }
  }

}
