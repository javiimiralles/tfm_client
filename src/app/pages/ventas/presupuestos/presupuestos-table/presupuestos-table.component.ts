import {Component, HostListener, OnInit} from '@angular/core';
import {Pedido} from '../../../../models/pedido.model';
import {PedidoFilter} from '../../../../filters/pedido.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {Modal} from 'flowbite';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {PedidosService} from '../../../../services/pedidos.service';
import {formatDate} from '../../../../utils/date.util';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-presupuestos-table',
  imports: [
    ConfirmationModalComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './presupuestos-table.component.html',
  standalone: true,
  styleUrl: './presupuestos-table.component.css'
})
export class PresupuestosTableComponent implements OnInit {

  presupuestos: Pedido[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  pedidoFilter: PedidoFilter = new PedidoFilter();
  filtersSubject = new BehaviorSubject<PedidoFilter>(new PedidoFilter());

  modal: Modal;
  idPedidoSeleccionado: number;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly pedidosService: PedidosService
  ) { }

  ngOnInit(): void {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadPresupuestos();
    });
  }

  openModal(idPedido: number, isAccept: boolean) {
    this.idPedidoSeleccionado = idPedido;
    const modalName = isAccept ? 'accept-modal' : 'cancel-modal';
    const modalEl = document.getElementById(modalName);
    if (!modalEl) return;
    this.modal = new Modal(modalEl);
    this.modal.show();
  }

  aceptarPresupuesto() {
    this.pedidosService.aceptarPresupuesto(this.idPedidoSeleccionado).subscribe({
      next: () => {
        this.alertsService.showAlert('Presupuesto aceptado', 'Se ha aceptado el presupuesto correctamente', 'success');
        this.loadPresupuestos();
        this.closeModal();
      },
      error: (err) => {
        this.alertsService.showError('Error al aceptar el presupuesto', err);
      }
    });
  }

  cancelarPresupuesto() {
    this.pedidosService.cancelarPresupuesto(this.idPedidoSeleccionado).subscribe({
      next: () => {
        this.alertsService.showAlert('Presupuesto cancelado', 'Se ha cancelado el presupuesto correctamente', 'success');
        this.loadPresupuestos();
        this.closeModal();
      },
      error: (err) => {
        this.alertsService.showError('Error al cancelar el presupuesto', err);
      }
    });
  }

  closeModal() {
    if (this.modal) this.modal.hide();
  }

  onFilterChange() {
    this.filtersSubject.next(this.pedidoFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadPresupuestos();
    }
  }

  toggleDropdownState(idPedido: number) {
    this.dropdownStates = {
      ...this.dropdownStates,
      [idPedido]: !this.dropdownStates[idPedido],
    };

    // Cerrar los demás dropdowns
    Object.keys(this.dropdownStates).forEach((key) => {
      if (Number(key) !== idPedido) {
        this.dropdownStates[Number(key)] = false;
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }

  private loadPresupuestos() {
    this.pedidoFilter = this.filtersSubject.getValue();
    this.pedidoFilter.page = this.pageNumber;
    this.pedidoFilter.size = this.pageSize;

    this.pedidosService.getPresupuestosByFilter(this.pedidoFilter).subscribe({
      next: (res) => {
        this.presupuestos = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los presupuestos', err);
      }
    })
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PRESUPUESTOS')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_PRESUPUESTOS');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_PRESUPUESTOS');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_PRESUPUESTOS');

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
