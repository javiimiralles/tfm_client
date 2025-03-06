import {Component, OnInit} from '@angular/core';
import {UsuariosService} from '../../services/usuarios.service';
import {AlertsService} from '../../services/alerts.service';
import {CestaService} from '../../services/cesta.service';
import {Proveedor} from '../../models/proveedor.model';
import {ItemCestaInterface} from '../../interfaces/item-cesta.interface';
import {CurrencyPipe} from '@angular/common';
import {PedidosProveedorService} from '../../services/pedidos-proveedor.service';
import {DetallePedidoProveedor} from '../../models/detalle-pedido-proveedor.model';

interface AgrupacionCesta {
  proveedor: Proveedor,
  items: ItemCestaInterface[]
}

@Component({
  selector: 'app-cesta',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './cesta.component.html',
  standalone: true,
  styleUrl: './cesta.component.css'
})
export class CestaComponent implements OnInit {

  showRealizarPedidoBtn: boolean = false;
  agrupacionCesta: AgrupacionCesta[] = [];
  selectedItems: { [proveedorId: number]: { [productoId: number]: boolean } } = {};

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly cestaService: CestaService,
    private readonly pedidosProveedoresService: PedidosProveedorService
  ) {
  }

  ngOnInit() {
    if (!this.checkPermissions()) return;
    this.agruparCesta();
  }

  realizarPedido(idProveedor: number) {
    const detallesPedido: DetallePedidoProveedor[] = this.agrupacionCesta.find(a => a.proveedor.id === idProveedor)?.items
      .filter(item => this.selectedItems[idProveedor]?.[item.producto.id])
      .map(item => ({producto: item.producto, cantidad: item.cantidad}));

    if (!detallesPedido || detallesPedido.length === 0) {
      this.alertsService.showAlert('Advertencia', 'No hay productos seleccionados para realizar el pedido', 'warning');
      return;
    }

    this.pedidosProveedoresService.realizarPedidoProveedor(detallesPedido, idProveedor)
      .subscribe(() => {
        this.alertsService.showAlert('Pedido realizado', 'Se ha realizado el pedido correctamente', 'success');
        for (const item of detallesPedido) {
          this.cestaService.removeProducto(item.producto.id);
        }
        this.agruparCesta();
      });
  }

  removeItem(idProducto: number) {
    this.cestaService.removeProducto(idProducto)
    this.agruparCesta();
  }

  toggleSelection(proveedorId: number, productoId: number | 'all') {
    if (productoId === 'all') {
      // Verificar si todos los productos de este proveedor están seleccionados
      const allSelected = this.agrupacionCesta.find(a => a.proveedor.id === proveedorId)
        ?.items.every(item => this.selectedItems[proveedorId]?.[item.producto.id]);

      // Inicializar si no existe
      if (!this.selectedItems[proveedorId]) {
        this.selectedItems[proveedorId] = {};
      }

      // Seleccionar o deseleccionar todos los productos
      this.agrupacionCesta.find(a => a.proveedor.id === proveedorId)?.items.forEach(item => {
        this.selectedItems[proveedorId][item.producto.id] = !allSelected;
      });
    } else {
      // Seleccionar/deseleccionar un solo producto
      if (!this.selectedItems[proveedorId]) {
        this.selectedItems[proveedorId] = {};
      }
      this.selectedItems[proveedorId][productoId] = !this.selectedItems[proveedorId][productoId];
    }
  }

  getSelectedCount(proveedorId: number): number {
    if (!this.selectedItems[proveedorId]) return 0;
    return Object.values(this.selectedItems[proveedorId]).filter(selected => selected).length;
  }

  isSelected(proveedorId: number, productoId: number): boolean {
    return this.selectedItems[proveedorId]?.[productoId] ?? false;
  }

  private agruparCesta() {
    const cesta = this.cestaService.getCesta();
    this.agrupacionCesta = [];
    cesta.forEach(item => {
      const proveedor = item.proveedor;
      const agrupacion = this.agrupacionCesta.find(a => a.proveedor.id === proveedor.id);

      if (!this.selectedItems[proveedor.id]) {
        this.selectedItems[proveedor.id] = {};
      }

      if (agrupacion) {
        agrupacion.items.push(item);
      } else {
        this.agrupacionCesta.push({proveedor, items: [item]});
      }
    });
  }

  private checkPermissions() {
    if (!this.usuariosService.checkPermissions('ACCESO_PEDIDOS_PROVEEDORES')) return false;

    this.showRealizarPedidoBtn = this.usuariosService.hasPermission('CREACION_PEDIDOS_PROVEEDORES');
    return true;
  }

}
