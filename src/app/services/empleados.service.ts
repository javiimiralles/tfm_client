import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {environment} from '../../environments/environment';
import {Empleado} from '../models/empleado.model';
import {EmpleadoFilter} from '../filters/empleado.filter';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private empleado: Empleado;

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService
  ) { }

  getEmpleadoById(idEmpleado: number) {
    return this.http.get(`${environment.apiUrl}/empleados/${idEmpleado}`, this.headersService.getHeaders());
  }

  getEmpleadoByIdUsuario(idUsuario: number) {
    return this.http.get(`${environment.apiUrl}/empleados/usuario/${idUsuario}`, this.headersService.getHeaders());
  }

  getEmpleadosByFilter(filter: EmpleadoFilter) {
    filter.idEmpresa = this.idEmpresa;
    return this.http.post(`${environment.apiUrl}/empleados/filter`, filter, this.headersService.getHeaders());
  }

  createEmpleado(empleado: Empleado, imagen: File) {
    empleado.idEmpresa = this.idEmpresa;
    const formData = new FormData();
    formData.append('empleado', JSON.stringify(empleado));
    formData.append('imagen', imagen);
    return this.http.post(`${environment.apiUrl}/empleados`, formData, this.headersService.getHeaders());

  }

  setEmpleado(empleado: Empleado) {
    this.empleado = empleado;
  }

  get id() {
    return this.empleado ? this.empleado.id : undefined;
  }

  get idEmpresa() {
    return this.empleado ? this.empleado.idEmpresa : undefined;
  }

  get idUsuario() {
    return this.empleado ? this.empleado.idUsuario : undefined;
  }

  get nombre() {
    return this.empleado ? this.empleado.nombre : undefined;
  }

  get apellidos() {
    return this.empleado ? this.empleado.apellidos : undefined;
  }

  get nif() {
    return this.empleado ? this.empleado.nif : undefined;
  }

  get telefono() {
    return this.empleado ? this.empleado.telefono : undefined;
  }

  get direccion() {
    return this.empleado ? this.empleado.direccion : undefined;
  }

  get pais() {
    return this.empleado ? this.empleado.pais : undefined;
  }

  get provincia() {
    return this.empleado ? this.empleado.provincia : undefined;
  }

  get poblacion() {
    return this.empleado ? this.empleado.poblacion : undefined;
  }

  get codigoPostal() {
    return this.empleado ? this.empleado.codigoPostal : undefined;
  }

  get fechaNacimiento() {
    return this.empleado ? this.empleado.fechaNacimiento : undefined;
  }

  get genero() {
    return this.empleado ? this.empleado.genero : undefined;
  }

  get idRespAlta() {
    return this.empleado ? this.empleado.idRespAlta : undefined;
  }

  get fechaAlta() {
    return this.empleado ? this.empleado.fechaAlta : undefined;
  }

  get idRespModif() {
    return this.empleado ? this.empleado.idRespModif : undefined;
  }

  get fechaModif() {
    return this.empleado ? this.empleado.fechaModif : undefined;
  }

  get idRespBaja() {
    return this.empleado ? this.empleado.idRespBaja : undefined;
  }

  get fechaBaja() {
    return this.empleado ? this.empleado.fechaBaja : undefined;
  }
}
