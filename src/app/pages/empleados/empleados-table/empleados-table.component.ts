import {Component, HostListener, OnInit} from '@angular/core';
import {Empleado} from '../../../models/empleado.model';
import {EmpleadoFilter} from '../../../filters/empleado.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {AlertsService} from '../../../services/alerts.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {EmpleadosService} from '../../../services/empleados.service';
import {formatDate} from '../../../utils/date.util';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {Rol} from '../../../models/rol.model';
import {RolesService} from '../../../services/roles.service';

@Component({
  selector: 'app-empleados-table',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './empleados-table.component.html',
  standalone: true,
  styleUrl: './empleados-table.component.css'
})
export class EmpleadosTableComponent implements OnInit{

  empleados: Empleado[] = [];
  roles: Rol[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  empleadoFilter: EmpleadoFilter = new EmpleadoFilter();
  filtersSubject = new BehaviorSubject<EmpleadoFilter>(new EmpleadoFilter());

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly empleadosService: EmpleadosService,
    private readonly alertsService: AlertsService,
    private readonly rolesService: RolesService
  ) { }

  ngOnInit() {
    if (!this.checkPermissions()) return;

    this.loadRoles();

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadEmpleados();
    });
  }

  loadEmpleados() {
    this.empleadoFilter = this.filtersSubject.getValue();
    this.empleadoFilter.page = this.pageNumber;
    this.empleadoFilter.size = this.pageSize;

    this.empleadosService.getEmpleadosByFilter(this.empleadoFilter).subscribe({
      next: (res) => {
        this.empleados = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los empleados', err);
      }
    });
  }

  loadRoles() {
    this.rolesService.getRoles().subscribe({
      next: (res) => {
        this.roles = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los roles', err);
      }
    })
  }

  onFilterChange() {
    this.filtersSubject.next(this.empleadoFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadEmpleados();
    }
  }

  toggleDropdownState(idCliente: number) {
    this.dropdownStates = {
      ...this.dropdownStates,
      [idCliente]: !this.dropdownStates[idCliente],
    };

    // Cerrar los demás dropdowns
    Object.keys(this.dropdownStates).forEach((key) => {
      if (Number(key) !== idCliente) {
        this.dropdownStates[Number(key)] = false;
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_EMPLEADOS')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_EMPLEADOS');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_EMPLEADOS');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_EMPLEADOS');

    return true;
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Verifica si el clic fue dentro de un dropdown o botón
    if (!target.closest('.dropdown') && !target.closest('.dropdown-button')) {
      // Si el clic fue fuera, cierra todos los dropdowns
      this.dropdownStates = {};
    }
  }

}
