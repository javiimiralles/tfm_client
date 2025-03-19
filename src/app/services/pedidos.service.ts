import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {PedidoFilter} from '../filters/pedido.filter';
import {TipoPedidoEnum} from '../enums/tipo-pedido.enum';
import {environment} from '../../environments/environment';
import {EstadoPedidoEnum} from '../enums/estado-pedido.enum';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getPedidosByFilter(filter: PedidoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    filter.tipoPedido = TipoPedidoEnum.PEDIDO;
    return this.http.post(`${environment.apiUrl}/pedidos/filter`, filter, this.headersService.getHeaders());
  }

  getPresupuestosByFilter(filter: PedidoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    filter.tipoPedido = TipoPedidoEnum.PRESUPUESTO;
    return this.http.post(`${environment.apiUrl}/pedidos/filter`, filter, this.headersService.getHeaders());
  }

  cancelarPresupuesto(idPedido: number) {
    return this.http.delete(`${environment.apiUrl}/pedidos/${idPedido}`, this.headersService.getHeaders());
  }

  updateEstadoPedido(idPedido: number, nuevoEstado: EstadoPedidoEnum) {
    const formData = new FormData();
    formData.append('nuevoEstado', nuevoEstado);
    return this.http.put(`${environment.apiUrl}/pedidos/estado/${idPedido}`, formData, this.headersService.getHeaders());
  }
}
