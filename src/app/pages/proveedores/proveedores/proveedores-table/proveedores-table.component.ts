import {Component, HostListener, OnInit} from '@angular/core';
import {Proveedor} from '../../../../models/proveedor.model';
import {ProveedorFilter} from '../../../../filters/proveedor.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {Modal} from 'flowbite';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {ProveedoresService} from '../../../../services/proveedores.service';
import {formatDate} from '../../../../utils/date.util';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-proveedores-table',
  imports: [
    ConfirmationModalComponent,
    FormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './proveedores-table.component.html',
  standalone: true,
  styleUrl: './proveedores-table.component.css'
})
export class ProveedoresTableComponent implements OnInit {

  proveedores: Proveedor[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  proveedorFilter: ProveedorFilter = new ProveedorFilter();
  filtersSubject = new BehaviorSubject<ProveedorFilter>(new ProveedorFilter());

  deleteModal: Modal;
  idProveedorSeleccionado: number;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly proveedoresService: ProveedoresService
  ) { }

  ngOnInit() {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadProveedores();
    });
  }

  openDeleteModal(idProveedor: number) {
    this.idProveedorSeleccionado = idProveedor;
    const modalEl = document.getElementById('confirmation-modal');
    if (!modalEl) return;
    this.deleteModal = new Modal(modalEl);
    this.deleteModal.show();
  }

  closeModal() {
    if (this.deleteModal) this.deleteModal.hide();
  }

  deleteProveedor() {
    if (this.idProveedorSeleccionado !== null) {
      this.proveedoresService.deleteProveedor(this.idProveedorSeleccionado).subscribe({
        next: () => {
          this.alertsService.showAlert('Proveedor eliminado', 'El proveedor se ha eliminado correctamente', 'success');
          this.loadProveedores();
          this.closeModal();
        },
        error: (err) => {
          this.alertsService.showError('Error al eliminar el proveedor', err);
        }
      });
    }
  }

  onFilterChange() {
    this.filtersSubject.next(this.proveedorFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadProveedores();
    }
  }

  toggleDropdownState(idProveedor: number) {
    this.dropdownStates = {
      ...this.dropdownStates,
      [idProveedor]: !this.dropdownStates[idProveedor],
    };

    // Cerrar los demás dropdowns
    Object.keys(this.dropdownStates).forEach((key) => {
      if (Number(key) !== idProveedor) {
        this.dropdownStates[Number(key)] = false;
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }

  private loadProveedores() {
    this.proveedorFilter = this.filtersSubject.getValue();
    this.proveedorFilter.page = this.pageNumber;
    this.proveedorFilter.size = this.pageSize;

    this.proveedoresService.getProveedoresByFilter(this.proveedorFilter).subscribe({
      next: (res) => {
        this.proveedores = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los preveedores', err);
      }
    })
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PROVEEDORES')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_PROVEEDORES');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_PROVEEDORES');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_PROVEEDORES');

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
