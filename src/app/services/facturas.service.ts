import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {environment} from '../../environments/environment';
import {FacturaFilter} from '../filters/factura.filter';
import {Factura} from '../models/factura.model';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getFacturaById(id: number) {
    return this.http.get(`${environment.apiUrl}/facturas/${id}`, this.headersService.getHeaders());
  }

  getFacturasByFilter(filter: FacturaFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/facturas/filter`, filter, this.headersService.getHeaders());
  }

  crearFactura(factura: Factura) {
    factura.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/facturas`, factura, {
      ...this.headersService.getHeaders(),
      responseType: 'blob' as 'json'
    });
  }

  genrarFacturaPdf(id: number) {
    return this.http.get(`${environment.apiUrl}/facturas/pdf/${id}`, {
      ...this.headersService.getHeaders(),
      responseType: 'blob' as 'json'
    });
  }

}
