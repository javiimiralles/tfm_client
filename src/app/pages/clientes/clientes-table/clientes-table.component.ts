import {Component, HostListener, OnInit} from '@angular/core';
import {Cliente} from '../../../models/cliente.model';
import {ClientesService} from '../../../services/clientes.service';
import {AlertsService} from '../../../services/alerts.service';
import {formatDate} from '../../../utils/date.util';
import {RouterLink} from '@angular/router';
import {UsuariosService} from '../../../services/usuarios.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import {ClienteFilter} from '../../../filters/cliente.filter';
import {NgClass} from '@angular/common';
import {Modal} from 'flowbite';
import {ConfirmationModalComponent} from '../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-clientes-table',
  imports: [RouterLink, ReactiveFormsModule, FormsModule, NgClass, ConfirmationModalComponent],
  templateUrl: './clientes-table.component.html',
  standalone: true,
  styleUrl: './clientes-table.component.css'
})
export class ClientesTableComponent implements OnInit {

  clientes: Cliente[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  clienteFilter: ClienteFilter = new ClienteFilter();
  filtersSubject = new BehaviorSubject<ClienteFilter>(new ClienteFilter());

  deleteModal: Modal;
  idClienteSeleccionado: number;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly clientesService: ClientesService,
    private readonly alertsService: AlertsService
  ) { }

  ngOnInit() {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadClientes();
    });
  }

  openDeleteModal(idCliente: number) {
    this.idClienteSeleccionado = idCliente;
    const modalEl = document.getElementById('confirmation-modal');
    if (!modalEl) return;
    this.deleteModal = new Modal(modalEl);
    this.deleteModal.show();
  }

  closeModal() {
    if (this.deleteModal) this.deleteModal.hide();
  }

  deleteCliente() {
    if (this.idClienteSeleccionado !== null) {
      this.clientesService.deleteCliente(this.idClienteSeleccionado).subscribe({
        next: () => {
          this.alertsService.showAlert('Cliente eliminado', 'El cliente se ha eliminado correctamente', 'success');
          this.closeModal();
          this.loadClientes();
        },
        error: (err) => {
          this.alertsService.showError('Error al eliminar el cliente', err);
        }
      });
    }
  }

  onFilterChange() {
    this.filtersSubject.next(this.clienteFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadClientes();
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

  private loadClientes() {
    this.clienteFilter = this.filtersSubject.getValue();
    this.clienteFilter.page = this.pageNumber;
    this.clienteFilter.size = this.pageSize;

    this.clientesService.getClientesByFilter(this.clienteFilter).subscribe({
      next: (res) => {
        this.clientes = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los clientes', err);
      }
    })
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_CLIENTES')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_CLIENTES');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_CLIENTES');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_CLIENTES');

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
