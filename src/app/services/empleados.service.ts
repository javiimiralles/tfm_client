import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {environment} from '../../environments/environment';
import {Empleado} from '../models/empleado.model';
import {AlertsService} from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private empleado: Empleado;

  constructor(private http: HttpClient, private headersService: HeadersService, private alertsService: AlertsService) { }

  getEmpleadoById(idEmpleado: number) {
    return this.http.get(`${environment.apiUrl}/empleados/${idEmpleado}`, this.headersService.getHeaders());
  }

  getEmpleadoByIdUsuario(idUsuario: number) {
    return this.http.get(`${environment.apiUrl}/empleados/usuario/${idUsuario}`, this.headersService.getHeaders());
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

  get telefono() {
    return this.empleado ? this.empleado.telefono : undefined;
  }

  get direccion() {
    return this.empleado ? this.empleado.direccion : undefined;
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
