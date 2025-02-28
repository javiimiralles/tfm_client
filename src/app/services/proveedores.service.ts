import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {environment} from '../../environments/environment';
import {ProveedorFilter} from '../filters/proveedor.filter';
import {Proveedor} from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getProveedorById(id: number) {
    return this.http.get(`${environment.apiUrl}/proveedores/${id}`, this.headersService.getHeaders());
  }

  getProveedoresByFilter(filter: ProveedorFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/proveedores/filter`, filter, this.headersService.getHeaders());
  }

  createProveedor(proveedor: Proveedor) {
    proveedor.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/proveedores`, proveedor, this.headersService.getHeaders());
  }

  updateProveedor(proveedor: Proveedor) {
    return this.http.put(`${environment.apiUrl}/proveedores/${proveedor.id}`, proveedor, this.headersService.getHeaders());
  }

  deleteProveedor(id: number) {
    return this.http.delete(`${environment.apiUrl}/proveedores/${id}`, this.headersService.getHeaders());
  }
}
