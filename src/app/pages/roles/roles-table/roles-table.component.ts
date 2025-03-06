import {Component, HostListener, OnInit} from '@angular/core';
import {UsuariosService} from '../../../services/usuarios.service';
import {AlertsService} from '../../../services/alerts.service';
import {Rol} from '../../../models/rol.model';
import {RolFilter} from '../../../filters/rol.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {Modal} from 'flowbite';
import {RolesService} from '../../../services/roles.service';
import {ConfirmationModalComponent} from '../../../components/confirmation-modal/confirmation-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-roles-table',
  imports: [
    ConfirmationModalComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './roles-table.component.html',
  standalone: true,
  styleUrl: './roles-table.component.css'
})
export class RolesTableComponent implements OnInit {

  roles: Rol[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  rolFilter: RolFilter = new RolFilter();
  filtersSubject = new BehaviorSubject<RolFilter>(new RolFilter());

  deleteModal: Modal;
  idRolSeleccionado: number;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly rolesService: RolesService
  ) {
  }

  ngOnInit(): void {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadRoles();
    });
  }

  openDeleteModal(idRol: number) {
    this.idRolSeleccionado = idRol;
    const modalEl = document.getElementById('confirmation-modal');
    if (!modalEl) return;
    this.deleteModal = new Modal(modalEl);
    this.deleteModal.show();
  }

  closeModal() {
    if (this.deleteModal) this.deleteModal.hide();
  }

  deleteRol() {
    if (!this.idRolSeleccionado) return;
    this.rolesService.deleteRol(this.idRolSeleccionado).subscribe({
      next: () => {
        this.alertsService.showAlert('Rol eliminado', 'El rol ha sido eliminado correctamente', 'success');
        this.loadRoles();
        this.closeModal();
      },
      error: (err) => {
        this.alertsService.showError('Error al eliminar el rol', err);
      }
    })
  }

  onFilterChange() {
    this.filtersSubject.next(this.rolFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadRoles();
    }
  }

  toggleDropdownState(idRol: number) {
    this.dropdownStates = {
      ...this.dropdownStates,
      [idRol]: !this.dropdownStates[idRol],
    };

    // Cerrar los demás dropdowns
    Object.keys(this.dropdownStates).forEach((key) => {
      if (Number(key) !== idRol) {
        this.dropdownStates[Number(key)] = false;
      }
    });
  }

  private loadRoles() {
    this.rolesService.getRolesByFilter(this.rolFilter).subscribe({
      next: (res) => {
        this.roles = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los roles', err);
      }
    })
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_ROLES')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_ROLES');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_ROLES');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_ROLES');

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
