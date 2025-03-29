import {Component, OnInit} from '@angular/core';
import {Pedido} from '../../../../models/pedido.model';
import {DetallePedido} from '../../../../models/detalle-pedido.model';
import {Modal} from 'flowbite';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../../services/alerts.service';
import {UsuariosService} from '../../../../services/usuarios.service';
import {PedidosService} from '../../../../services/pedidos.service';
import {DetallesPedidoService} from '../../../../services/detalles-pedido.service';
import {formatDate} from '../../../../utils/date.util';
import {EstadoPedidoProveedorEnum} from '../../../../enums/estado-pedido-proveedor.enum';
import {EstadoPedidoEnum} from '../../../../enums/estado-pedido.enum';
import {ConfirmationModalComponent} from '../../../../components/confirmation-modal/confirmation-modal.component';
import {CurrencyPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-pedido-details',
  imports: [
    ConfirmationModalComponent,
    CurrencyPipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './pedido-details.component.html',
  standalone: true,
  styleUrl: './pedido-details.component.css'
})
export class PedidoDetailsComponent implements OnInit {

  pedido: Pedido;
  detallesPedido: DetallePedido[] = [];

  showCambiarEstadoButton = false;
  showCancelarButton = false;

  modal: Modal;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly usuariosService: UsuariosService,
    private readonly pedidosService: PedidosService,
    private readonly detallesPedidoService: DetallesPedidoService
  ) { }

  ngOnInit() {
    if (!this.checkPermissions()) return;
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) {
      this.router.navigate(['/user/ventas/pedidos-table']);
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
    if (this.pedido.estado !== EstadoPedidoEnum.RECIBIDO && this.pedido.estado !== EstadoPedidoEnum.CANCELADO) {
      let nuevoEstado: EstadoPedidoEnum;
      switch (this.pedido.estado.toUpperCase()) {
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

      this.pedidosService.updateEstadoPedido(this.pedido.id, nuevoEstado).subscribe({
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
    this.pedidosService.updateEstadoPedido(this.pedido.id, EstadoPedidoEnum.CANCELADO).subscribe({
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
    this.pedidosService.getPedidoById(id).subscribe({
      next: (res) => {
        this.pedido = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el pedido', err);
      }
    });
  }

  private loadDetallesPedido(idPedido: number) {
    this.detallesPedidoService.getDetallesPedidoByPedidoId(idPedido).subscribe({
      next: (res) => {
        this.detallesPedido = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los detalles del pedido', err);
      }
    });
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PEDIDOS')) return false;

    this.showCambiarEstadoButton = this.usuariosService.hasPermission('EDICION_PEDIDOS');
    this.showCancelarButton = this.usuariosService.hasPermission('ELIMINACION_PEDIDOS');

    return true;
  }

}
