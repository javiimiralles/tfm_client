import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmpleadosService} from './empleados.service';
import {environment} from '../../environments/environment';
import {HeadersService} from './headers.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient, private headersService: HeadersService, private empleadosService: EmpleadosService) { }

  getRoles() {
    const idEmpresa = this.empleadosService.idEmpresa;
    return this.http.get(`${environment.apiUrl}/roles/empresa/${idEmpresa}`, this.headersService.getHeaders())
  }
}
