import { Injectable } from '@angular/core';
import {EmpleadosService} from './empleados.service';
import {HeadersService} from './headers.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CategoriaProductoFilter} from '../filters/categoria-producto.filter';
import {CategoriaProducto} from '../models/categoria-producto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasProductoService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getCategoriaProductoById(id: number) {
    return this.http.get(`${environment.apiUrl}/categorias-productos/${id}`, this.headersService.getHeaders());
  }

  getCategoriasProductoByFilter(filter: CategoriaProductoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/categorias-productos/filter`, filter, this.headersService.getHeaders());
  }

  createCategoriaProducto(categoriaProducto: CategoriaProducto) {
    categoriaProducto.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/categorias-productos`, categoriaProducto, this.headersService.getHeaders());
  }

  updateCategoriaProducto(categoriaProducto: CategoriaProducto) {
    return this.http.put(`${environment.apiUrl}/categorias-productos/${categoriaProducto.id}`, categoriaProducto, this.headersService.getHeaders());
  }
}
