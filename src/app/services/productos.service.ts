import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {ProductoFilter} from '../filters/producto.filter';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getProductosByFilter(filter: ProductoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/productos/filter`, filter, this.headersService.getHeaders());
  }
}
