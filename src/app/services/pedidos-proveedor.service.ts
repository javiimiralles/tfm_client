import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {DetallePedidoProveedor} from '../models/detalle-pedido-proveedor.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosProveedorService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

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
}
