import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetallesPedidoProveedorService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService
  ) { }

  getDetallesPedidoProveedorByIdPedidoProveedor(idPedido: number) {
    return this.http.get(`${environment.apiUrl}/detalles-pedido-proveedor/pedido/${idPedido}`, this.headersService.getHeaders());
  }
}
