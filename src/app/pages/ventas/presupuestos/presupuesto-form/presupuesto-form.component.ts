import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatosPedidoForm} from '../../../../forms/datos-pedido.form';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../../services/alerts.service';
import {UsuariosService} from '../../../../services/usuarios.service';
import {PedidosService} from '../../../../services/pedidos.service';
import {Pedido} from '../../../../models/pedido.model';
import {DetallePedido} from '../../../../models/detalle-pedido.model';
import {DetallesPedidoService} from '../../../../services/detalles-pedido.service';
import {Modal} from 'flowbite';
import {EstadoPedidoEnum} from '../../../../enums/estado-pedido.enum';
import {Cliente} from '../../../../models/cliente.model';
import {ClientesService} from '../../../../services/clientes.service';
import {ClienteFilter} from '../../../../filters/cliente.filter';
import {CurrencyPipe, NgClass} from '@angular/common';
import {MetodoPagoEnum} from '../../../../enums/metodo-pago.enum';
import {Producto} from '../../../../models/producto.model';
import {ProductosService} from '../../../../services/productos.service';
import {ProductoFilter} from '../../../../filters/producto.filter';

@Component({
  selector: 'app-presupuesto-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './presupuesto-form.component.html',
  standalone: true,
  styleUrl: './presupuesto-form.component.css'
})
export class PresupuestoFormComponent implements OnInit {

  pedidoForm: FormGroup = new FormGroup({
    cliente: new FormControl('', [Validators.required]),
    metodoPago: new FormControl(null),
    observaciones: new FormControl(null)
  });

  nuevoProductoForm: FormGroup = new FormGroup({
    producto: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    precio: new FormControl(''),
    subtotal: new FormControl('')
  });

  showCreatePresupuestoButton = false;
  showAceptarPresupuestoButton = false;
  showRechazarPresupuestoButton = false;

  cardTitle: string = 'Crear un nuevo presupuesto';
  presupuesto: Pedido;
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  metodosPago: string[] = Object.values(MetodoPagoEnum);
  detallesPedido: DetallePedido[] = [];
  datosPedido: DatosPedidoForm;

  modal: Modal;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly usuariosService: UsuariosService,
    private readonly pedidosService: PedidosService,
    private readonly detallesPedidoService: DetallesPedidoService,
    private readonly clientesService: ClientesService,
    private readonly productosService: ProductosService
  ) {}

  ngOnInit() {
    if (!this.checkPermissions()) return;
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      this.cardTitle = 'Editar presupuesto';
      this.loadPresupuesto(id);
      this.loadDetallesPedido(id);
    }
    this.loadClientes();

    this.nuevoProductoForm.get('producto').valueChanges.subscribe(productId => {
      this.setPrecioYSubtotal(productId);
    });

    this.nuevoProductoForm.get('cantidad').valueChanges.subscribe(() => {
      this.actualizarSubtotal();
    });
  }

  onSubmit() {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    if (!this.detallesPedido || this.detallesPedido.length === 0) {
      this.alertsService.showError('Debes añadir al menos un producto al presupuesto');
      return;
    }

    if (this.presupuesto) {
      this.updatePresupuesto();
    } else {
      this.createPresupuesto();
    }

  }

  openAddProductoModal() {
    if (!this.productos || this.productos.length === 0) this.loadProductos();
    this.nuevoProductoForm.reset();
    this.modal = new Modal(document.getElementById('add-product-modal'));
    this.modal.show();
  }

  openAceptarPresupuestoModal() {

  }

  openCancelarPresupuestoModal() {

  }

  cancelarPresupuesto() {
    this.pedidosService.updateEstadoPedido(this.presupuesto.id, EstadoPedidoEnum.CANCELADO).subscribe({
      next: () => {
        this.alertsService.showAlert('Pedido cancelado', 'El pedido ha sido cancelado correctamente', 'success');
        this.loadPresupuesto(this.presupuesto.id);
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

  addProducto() {
    if (this.nuevoProductoForm.invalid) {
      this.nuevoProductoForm.markAllAsTouched();
      return;
    }

    const productoId = this.nuevoProductoForm.get('producto').value;
    const producto = this.productos.find(p => p.id === +productoId);
    const cantidad = this.nuevoProductoForm.get('cantidad').value;
    const precio = this.nuevoProductoForm.get('precio').value;
    const subtotal = this.nuevoProductoForm.get('subtotal').value;

    const detallePedido = new DetallePedido();
    detallePedido.producto = producto;
    detallePedido.cantidad = cantidad;
    detallePedido.precioUnitario = precio;
    detallePedido.subtotal = subtotal;

    this.detallesPedido.push(detallePedido);
    this.closeModal();
  }

  removeProducto(id: number) {
    this.detallesPedido = this.detallesPedido.filter(dp => dp.id !== id);
  }

  private createPresupuesto() {
    this.fillObject();
    this.pedidosService.createPresupuesto(this.datosPedido).subscribe({
      next: () => {
        this.alertsService.showAlert('Presupuesto creado', 'El presupuesto se ha creado correctamente', 'success');
        this.router.navigate(['/user/ventas/presupuestos-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al crear el presupuesto', err);
      }
    })
  }

  private updatePresupuesto() {
    this.fillObject();
    this.pedidosService.updatePresupuesto(this.presupuesto.id, this.datosPedido).subscribe({
      next: () => {
        this.alertsService.showAlert('Presupuesto actualizado', 'El presupuesto se ha actualizado correctamente', 'success');
        this.router.navigate(['/user/ventas/presupuestos-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al actualizar el presupuesto', err);
      }
    })
  }

  private setPrecioYSubtotal(productoId: number) {
    const productoSeleccionado = this.productos.find(p => p.id === +productoId);
    if (productoSeleccionado) {
      this.nuevoProductoForm.get('precio').setValue(productoSeleccionado.precioVenta);
      this.actualizarSubtotal();
    }
  }

  private actualizarSubtotal() {
    const precio = +this.nuevoProductoForm.get('precio').value || 0;
    const cantidad = +this.nuevoProductoForm.get('cantidad').value || 0;
    const subtotal = precio * cantidad;
    this.nuevoProductoForm.get('subtotal').setValue(subtotal.toFixed(2));
  }

  private loadPresupuesto(id: number) {
    this.pedidosService.getPedidoById(id).subscribe({
      next: (res) => {
        if (!res['data']) {
          this.alertsService.showError('Presupuesto no encontrado');
          this.router.navigate(['/user/ventas/presupuestos-table']);
          return;
        }
        this.presupuesto = res['data'];
        this.fillForm();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el presupuesto', err);
        this.router.navigate(['/user/ventas/presupuestos-table']);
      }
    })
  }

  private loadDetallesPedido(id: number) {
    this.detallesPedidoService.getDetallesPedidoByPedidoId(id).subscribe({
      next: (res) => {
        this.detallesPedido = res['data'];
        this.fillDetallePedido();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el presupuesto', err);
        this.router.navigate(['/user/ventas/presupuestos-table']);
      }
    })
  }

  private loadClientes() {
    this.clientesService.getClientesByFilter(new ClienteFilter()).subscribe({
      next: (res) => {
        this.clientes = res['data']?.content;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los clientes', err);
      }
    })
  }

  private loadProductos() {
    this.productosService.getProductosByEmpresa().subscribe({
      next: (res) => {
        this.productos = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los productos', err);
      }
    })
  }

  private fillForm() {
    this.pedidoForm.get('cliente').setValue(this.presupuesto.cliente.id);
    this.pedidoForm.get('metodoPago').setValue(this.presupuesto.metodoPago);
    this.pedidoForm.get('observaciones').setValue(this.presupuesto.observaciones);

    this.datosPedido = new DatosPedidoForm();
    this.datosPedido.idEmpresa = this.presupuesto.idEmpresa;
    this.datosPedido.idCliente = this.presupuesto.cliente.id;
    this.datosPedido.metodoPago = this.presupuesto.metodoPago;
    this.datosPedido.observaciones = this.presupuesto.observaciones;
  }

  private fillDetallePedido() {
    this.datosPedido.detallesPedido = this.detallesPedido;
  }

  private fillObject() {
    if (!this.datosPedido) this.datosPedido = new DatosPedidoForm();
    this.datosPedido.idCliente = this.pedidoForm.get('cliente').value;
    this.datosPedido.metodoPago = this.pedidoForm.get('metodoPago').value;
    this.datosPedido.observaciones = this.pedidoForm.get('observaciones').value;
    this.datosPedido.detallesPedido = this.detallesPedido;
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PRESUPUESTOS')) return false;

    this.showCreatePresupuestoButton = this.usuariosService.hasPermission('CREACION_PRESUPUESTOS');
    this.showAceptarPresupuestoButton = this.usuariosService.hasPermission('EDICION_PRESUPUESTOS');
    this.showRechazarPresupuestoButton = this.usuariosService.hasPermission('ELIMINACION_PRESUPUESTOS');

    return true;
  }

}
