import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{

  email: string = '';
  nombre: string = '';
  isDropdownOpen: boolean = false;

  constructor(private usuariosService: UsuariosService, private empleadosService: EmpleadosService) {
    this.email = usuariosService.email!;
    this.nombre = empleadosService.nombre!;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  logout() {
    this.usuariosService.logout();
  }

}
