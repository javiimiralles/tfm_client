import { Injectable } from '@angular/core';
import {EmpleadosService} from './empleados.service';
import {HeadersService} from './headers.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasProductoService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getCategoriasProducto() {
    const idEmpresa = this.empleadosService.idEmpresa;
    return this.http.get(`${environment.apiUrl}/categorias-producto/empresa/${idEmpresa}`, this.headersService.getHeaders());
  }
}
