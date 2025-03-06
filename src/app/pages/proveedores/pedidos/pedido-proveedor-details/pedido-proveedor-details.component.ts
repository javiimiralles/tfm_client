import {Component, OnInit} from '@angular/core';
import {PedidoProveedor} from '../../../../models/pedido-proveedor.model';
import {DetallePedidoProveedor} from '../../../../models/detalle-pedido-proveedor.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../../services/alerts.service';
import {UsuariosService} from '../../../../services/usuarios.service';
import {PedidosProveedorService} from '../../../../services/pedidos-proveedor.service';
import {DetallesPedidoProveedorService} from '../../../../services/detalles-pedido-proveedor.service';
import {formatDate} from '../../../../utils/date.util';
import {CurrencyPipe, NgClass} from '@angular/common';
import {Modal} from 'flowbite';
import {EstadoPedidoProveedorEnum} from '../../../../enums/estado-pedido-proveedor.enum';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-pedido-proveedor-details',
  imports: [
    NgClass,
    RouterLink,
    CurrencyPipe,
    ConfirmationModalComponent
  ],
  templateUrl: './pedido-proveedor-details.component.html',
  standalone: true,
  styleUrl: './pedido-proveedor-details.component.css'
})
export class PedidoProveedorDetailsComponent implements OnInit {

  pedido: PedidoProveedor;
  detallesPedido: DetallePedidoProveedor[] = [];

  showCambiarEstadoButton = false;
  showCancelarButton = false;

  modal: Modal;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly usuariosService: UsuariosService,
    private readonly pedidosProveedorService: PedidosProveedorService,
    private readonly detallesPedidoProveedorService: DetallesPedidoProveedorService
  ) {}

  ngOnInit() {
    if (!this.checkPermissions()) return;
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) {
      this.router.navigate(['/user/proveedores/pedidos-proveedores-table']);
      return;
    }
    this.loadPedido(id);
    this.loadDetallesPedido(id);
  }

  openCambiarEstadoPedidoModal() {
    const modalEl = document.getElementById('change-state-modal');
    if (!modalEl) return;
    this.modal = new Modal(modalEl);
    this.modal.show();
  }

  openCancelarPedidoModal() {
    const modalEl = document.getElementById('cancel-modal');
    if (!modalEl) return;
    this.modal = new Modal(modalEl);
    this.modal.show();
  }

  cambiarSiguienteEstadoPedido() {
    if (this.pedido.estado !== EstadoPedidoProveedorEnum.RECIBIDO && this.pedido.estado !== EstadoPedidoProveedorEnum.CANCELADO) {
      let nuevoEstado: EstadoPedidoProveedorEnum;
      switch (this.pedido.estado.toUpperCase()) {
        case EstadoPedidoProveedorEnum.PENDIENTE.toUpperCase():
          nuevoEstado = EstadoPedidoProveedorEnum.ENVIADO;
          break;
        case EstadoPedidoProveedorEnum.ENVIADO.toUpperCase():
          nuevoEstado = EstadoPedidoProveedorEnum.RECIBIDO;
          break;
        default:
          nuevoEstado = EstadoPedidoProveedorEnum.PENDIENTE;
      }

      this.pedidosProveedorService.updateEstadoPedidoProveedor(this.pedido.id, nuevoEstado).subscribe({
        next: () => {
          this.alertsService.showAlert('Estado actualizado', 'El estado del pedido ha sido actualizado correctamente', 'success');
          this.loadPedido(this.pedido.id);
          this.closeModal();
        },
        error: (err) => {
          this.alertsService.showError('Error al actualizar el estado del pedido', err);
        }
      });
    }
  }

  cancelarPedido() {
    this.pedidosProveedorService.updateEstadoPedidoProveedor(this.pedido.id, EstadoPedidoProveedorEnum.CANCELADO).subscribe({
      next: () => {
        this.alertsService.showAlert('Pedido cancelado', 'El pedido ha sido cancelado correctamente', 'success');
        this.loadPedido(this.pedido.id);
        this.closeModal();
      },
      error: (err) => {
        this.alertsService.showError('Error al cancelar el pedido', err);
      }
    });
  }

  closeModal() {
    if (this.modal) this.modal.hide();
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }

  private loadPedido(id: number) {
    this.pedidosProveedorService.getPedidoProveedorById(id).subscribe({
      next: (res) => {
        this.pedido = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el pedido', err);
      }
    });
  }

  private loadDetallesPedido(idPedido: number) {
    this.detallesPedidoProveedorService.getDetallesPedidoProveedorByIdPedidoProveedor(idPedido).subscribe({
      next: (res) => {
        this.detallesPedido = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los detalles del pedido', err);
      }
    });
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PEDIDOS_PROVEEDORES')) return false;

    this.showCambiarEstadoButton = this.usuariosService.hasPermission('EDICION_PEDIDOS_PROVEEDORES');
    this.showCancelarButton = this.usuariosService.hasPermission('ELIMINACION_PEDIDOS_PROVEEDORES');

    return true;
  }

}
