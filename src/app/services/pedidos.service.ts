import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {PedidoFilter} from '../filters/pedido.filter';
import {TipoPedidoEnum} from '../enums/tipo-pedido.enum';
import {environment} from '../../environments/environment';
import {EstadoPedidoEnum} from '../enums/estado-pedido.enum';
import {DatosPedidoForm} from '../forms/datos-pedido.form';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getPedidoById(id: number) {
    return this.http.get(`${environment.apiUrl}/pedidos/${id}`, this.headersService.getHeaders());
  }

  getPedidosByFilter(filter: PedidoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    filter.tipo = TipoPedidoEnum.PEDIDO;
    return this.http.post(`${environment.apiUrl}/pedidos/filter`, filter, this.headersService.getHeaders());
  }

  getPresupuestosByFilter(filter: PedidoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    filter.tipo = TipoPedidoEnum.PRESUPUESTO;
    return this.http.post(`${environment.apiUrl}/pedidos/filter`, filter, this.headersService.getHeaders());
  }

  createPresupuesto(datosPedido: DatosPedidoForm) {
    datosPedido.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/pedidos/presupuestos`, datosPedido, this.headersService.getHeaders());
  }

  updatePresupuesto(idPedido: number, datosPedido: DatosPedidoForm) {
    datosPedido.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.put(`${environment.apiUrl}/pedidos/presupuestos/${idPedido}`, datosPedido, this.headersService.getHeaders());
  }

  aceptarPresupuesto(idPedido: number) {
    return this.http.put(`${environment.apiUrl}/pedidos/presupuestos/aceptar/${idPedido}`, null, this.headersService.getHeaders());
  }

  cancelarPresupuesto(idPedido: number) {
    return this.http.put(`${environment.apiUrl}/pedidos/presupuestos/cancelar/${idPedido}`, null, this.headersService.getHeaders());
  }

  updateEstadoPedido(idPedido: number, nuevoEstado: EstadoPedidoEnum) {
    const formData = new FormData();
    formData.append('nuevoEstado', nuevoEstado);
    return this.http.put(`${environment.apiUrl}/pedidos/estado/${idPedido}`, formData, this.headersService.getHeaders());
  }
}
