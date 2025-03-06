import {Component, HostListener, OnInit} from '@angular/core';
import {PedidoProveedor} from '../../../../models/pedido-proveedor.model';
import {PedidoProveedorFilter} from '../../../../filters/pedido-proveedor.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {Modal} from 'flowbite';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {PedidosProveedorService} from '../../../../services/pedidos-proveedor.service';
import {formatDate} from '../../../../utils/date.util';
import {EstadoPedidoProveedorEnum} from '../../../../enums/estado-pedido-proveedor.enum';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-pedidos-proveedores-table',
  imports: [
    ConfirmationModalComponent,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './pedidos-proveedores-table.component.html',
  standalone: true,
  styleUrl: './pedidos-proveedores-table.component.css'
})
export class PedidosProveedoresTableComponent implements OnInit {

  pedidos: PedidoProveedor[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCambiarEstadoButton = false;
  showCancelarButton = false;

  pedidoFilter: PedidoProveedorFilter = new PedidoProveedorFilter();
  filtersSubject = new BehaviorSubject<PedidoProveedorFilter>(new PedidoProveedorFilter());

  modal: Modal;
  idPedidoSeleccionado: number;
  estadoPedidoSeleccionado: EstadoPedidoProveedorEnum;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly pedidosProveedoresService: PedidosProveedorService
  ) {
  }

  ngOnInit() {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadPedidos();
    });
  }

  cambiarSiguienteEstadoPedido() {
    if (this.estadoPedidoSeleccionado !== EstadoPedidoProveedorEnum.RECIBIDO && this.estadoPedidoSeleccionado !== EstadoPedidoProveedorEnum.CANCELADO) {
      let nuevoEstado: EstadoPedidoProveedorEnum;
      switch (this.estadoPedidoSeleccionado) {
        case EstadoPedidoProveedorEnum.PENDIENTE.toUpperCase():
          nuevoEstado = EstadoPedidoProveedorEnum.ENVIADO;
          break;
        case EstadoPedidoProveedorEnum.ENVIADO.toUpperCase():
          nuevoEstado = EstadoPedidoProveedorEnum.RECIBIDO;
          break;
        default:
          nuevoEstado = EstadoPedidoProveedorEnum.PENDIENTE;
      }

      this.pedidosProveedoresService.updateEstadoPedidoProveedor(this.idPedidoSeleccionado, nuevoEstado).subscribe({
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
    this.pedidosProveedoresService.updateEstadoPedidoProveedor(this.idPedidoSeleccionado, EstadoPedidoProveedorEnum.CANCELADO).subscribe({
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

  openCambiarEstadoPedidoModal(idPedido: number, estadoActual: EstadoPedidoProveedorEnum | string) {
    this.idPedidoSeleccionado = idPedido;
    this.estadoPedidoSeleccionado = estadoActual as EstadoPedidoProveedorEnum;
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

  private loadPedidos() {
    this.pedidoFilter = this.filtersSubject.getValue();
    this.pedidoFilter.page = this.pageNumber;
    this.pedidoFilter.size = this.pageSize;

    this.pedidosProveedoresService.getPedidosProveedorByFilter(this.pedidoFilter).subscribe({
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
    if (!this.usuariosService.checkPermissions('ACCESO_PEDIDOS_PROVEEDORES')) return false;

    this.showCambiarEstadoButton = this.usuariosService.hasPermission('EDICION_PEDIDOS_PROVEEDORES');
    this.showCancelarButton = this.usuariosService.hasPermission('ELIMINACION_PEDIDOS_PROVEEDORES');

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
