import {Component, HostListener, OnInit} from '@angular/core';
import {Pedido} from '../../../../models/pedido.model';
import {PedidoFilter} from '../../../../filters/pedido.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {Modal} from 'flowbite';
import {EstadoPedidoEnum} from '../../../../enums/estado-pedido.enum';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {PedidosService} from '../../../../services/pedidos.service';
import {formatDate} from '../../../../utils/date.util';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {CurrencyPipe, NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-pedidos-table',
  imports: [
    ConfirmationModalComponent,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './pedidos-table.component.html',
  standalone: true,
  styleUrl: './pedidos-table.component.css'
})
export class PedidosTableComponent implements OnInit {

  pedidos: Pedido[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showCambiarEstadoButton = false;
  showCancelarButton = false;

  pedidoFilter: PedidoFilter = new PedidoFilter();
  filtersSubject = new BehaviorSubject<PedidoFilter>(new PedidoFilter());

  modal: Modal;
  idPedidoSeleccionado: number;
  estadoPedidoSeleccionado: EstadoPedidoEnum;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly pedidosService: PedidosService
  ) {}

  ngOnInit() {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadPedidos();
    });
  }

  cambiarSiguienteEstadoPedido() {
    if (this.estadoPedidoSeleccionado !== EstadoPedidoEnum.RECIBIDO && this.estadoPedidoSeleccionado !== EstadoPedidoEnum.CANCELADO) {
      let nuevoEstado: EstadoPedidoEnum;
      switch (this.estadoPedidoSeleccionado) {
        case EstadoPedidoEnum.PENDIENTE.toUpperCase():
          nuevoEstado = EstadoPedidoEnum.PROCESADO;
          break;
        case EstadoPedidoEnum.PROCESADO.toUpperCase():
          nuevoEstado = EstadoPedidoEnum.ENVIADO;
          break;
        case EstadoPedidoEnum.ENVIADO.toUpperCase():
          nuevoEstado = EstadoPedidoEnum.RECIBIDO;
          break;
        default:
          nuevoEstado = EstadoPedidoEnum.PENDIENTE;
      }

      this.pedidosService.updateEstadoPedido(this.idPedidoSeleccionado, nuevoEstado).subscribe({
        next: () => {
          this.alertsService.showAlert('Estado actualizado', 'El estado del pedido ha sido actualizado correctamente', 'success');
          this.loadPedidos();
          this.closeModal();
        },
        error: (err) => {
          this.alertsService.showError('Error al actualizar el estado del pedido', err);
        }
      });
    }
  }

  cancelarPedido() {
    this.pedidosService.updateEstadoPedido(this.idPedidoSeleccionado, EstadoPedidoEnum.CANCELADO).subscribe({
      next: () => {
        this.alertsService.showAlert('Pedido cancelado', 'El pedido ha sido cancelado correctamente', 'success');
        this.loadPedidos();
        this.closeModal();
      },
      error: (err) => {
        this.alertsService.showError('Error al cancelar el pedido', err);
      }
    });
  }

  openCambiarEstadoPedidoModal(idPedido: number, estadoActual: EstadoPedidoEnum | string) {
    this.idPedidoSeleccionado = idPedido;
    this.estadoPedidoSeleccionado = estadoActual as EstadoPedidoEnum;
    const modalEl = document.getElementById('change-state-modal');
    if (!modalEl) return;
    this.modal = new Modal(modalEl);
    this.modal.show();
  }

  openCancelarPedidoModal(idPedido: number) {
    this.idPedidoSeleccionado = idPedido;
    const modalEl = document.getElementById('cancel-modal');
    if (!modalEl) return;
    this.modal = new Modal(modalEl);
    this.modal.show();
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
      this.loadPedidos();
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

  private loadPedidos(): void {
    this.pedidoFilter = this.filtersSubject.getValue();
    this.pedidoFilter.page = this.pageNumber;
    this.pedidoFilter.size = this.pageSize;

    this.pedidosService.getPedidosByFilter(this.pedidoFilter).subscribe({
      next: (res) => {
        this.pedidos = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los pedidos', err);
      }
    })
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PEDIDOS')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_PEDIDOS');
    this.showCambiarEstadoButton = this.usuariosService.hasPermission('EDICION_PEDIDOS');
    this.showCancelarButton = this.usuariosService.hasPermission('ELIMINACION_PEDIDOS');

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
