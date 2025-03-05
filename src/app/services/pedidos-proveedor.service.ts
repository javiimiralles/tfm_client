import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {DetallePedidoProveedor} from '../models/detalle-pedido-proveedor.model';
import {environment} from '../../environments/environment';
import {PedidoProveedorFilter} from '../filters/pedido-proveedor.filter';
import {EstadoPedidoProveedorEnum} from '../enums/estado-pedido-proveedor.enum';

@Injectable({
  providedIn: 'root'
})
export class PedidosProveedorService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getPedidoProveedorById(id: number) {
    return this.http.get(`${environment.apiUrl}/pedidos-proveedor/${id}`, this.headersService.getHeaders());
  }

  getPedidosProveedorByFilter(filter: PedidoProveedorFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/pedidos-proveedor/filter`, filter, this.headersService.getHeaders());
  }

  realizarPedidoProveedor(detallesPedido: DetallePedidoProveedor[], idProveedor: number) {
    const formData = new FormData();
    const datosPedidoProveedor = {
      idProveedor: idProveedor,
      idEmpresa: this.empleadosService.idEmpresa,
      detallesPedido: detallesPedido
    };
    formData.append('datosPedidoProveedor', JSON.stringify(datosPedidoProveedor));
    return this.http.post(`${environment.apiUrl}/pedidos-proveedor`, formData, this.headersService.getHeaders());
  }

  updateEstadoPedidoProveedor(idPedido: number, nuevoEstado: EstadoPedidoProveedorEnum) {
    const formData = new FormData();
    formData.append('nuevoEstado', nuevoEstado);
    return this.http.put(`${environment.apiUrl}/pedidos-proveedor/estado/${idPedido}`, formData, this.headersService.getHeaders());
  }
}
