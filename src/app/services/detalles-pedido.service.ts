import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetallesPedidoService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService
  ) { }

  getDetallesPedidoByPedidoId(id: number) {
    return this.http.get(`${environment.apiUrl}/detalles-pedido/pedido/${id}`, this.headersService.getHeaders());
  }
}
