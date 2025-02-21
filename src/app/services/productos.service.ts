import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {ProductoFilter} from '../filters/producto.filter';
import {environment} from '../../environments/environment';
import {Producto} from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getProductoById(id: number) {
    return this.http.get(`${environment.apiUrl}/productos/${id}`, this.headersService.getHeaders());
  }

  getProductosByFilter(filter: ProductoFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/productos/filter`, filter, this.headersService.getHeaders());
  }

  createProducto(producto: Producto, imagen: File) {
    producto.idEmpresa = this.empleadosService.idEmpresa;
    const formData = new FormData();
    formData.append('producto', JSON.stringify(producto));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return this.http.post(`${environment.apiUrl}/productos`, formData, this.headersService.getHeaders());
  }

  updateProducto(producto: Producto, imagen: File, imageChanged: boolean) {
    const formData = new FormData();
    formData.append('producto', JSON.stringify(producto));
    if (imagen) {
      formData.append('imagen', imagen);
    }
    return this.http.put(`${environment.apiUrl}/productos/${producto.id}?imageChanged=${imageChanged}`, formData, this.headersService.getHeaders());
  }
}
