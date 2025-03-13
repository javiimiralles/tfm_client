import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmpleadosService} from './empleados.service';
import {environment} from '../../environments/environment';
import {HeadersService} from './headers.service';
import {RolFilter} from '../filters/rol.filter';
import {RolForm} from '../forms/rol.form';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getRolById(id: number) {
    return this.http.get(`${environment.apiUrl}/roles/${id}`, this.headersService.getHeaders())
  }

  getRoles() {
    const idEmpresa = this.empleadosService.idEmpresa;
    return this.http.get(`${environment.apiUrl}/roles/empresa/${idEmpresa}`, this.headersService.getHeaders())
  }

  getRolesByFilter(filter: RolFilter) {
    filter.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/roles/filter`, filter, this.headersService.getHeaders())
  }

  createRol(rolForm: RolForm) {
    rolForm.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/roles`, rolForm, this.headersService.getHeaders())
  }

  updateRol(id: number, rolForm: RolForm) {
    rolForm.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.put(`${environment.apiUrl}/roles/${id}`, rolForm, this.headersService.getHeaders())
  }

  deleteRol(id: number) {
    return this.http.delete(`${environment.apiUrl}/roles/${id}`, this.headersService.getHeaders())
  }
}
