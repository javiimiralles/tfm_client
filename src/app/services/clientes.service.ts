import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import { environment } from '../../environments/environment';
import {Cliente} from '../models/cliente.model';
import {EmpleadosService} from './empleados.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient, private headersService: HeadersService, private empleadosService: EmpleadosService) { }

  getClienteById(id: number) {
    return this.http.get(`${environment.apiUrl}/clientes/${id}`, this.headersService.getHeaders());
  }

  getClientesByEmpresa(idEmpresa: number) {
    return this.http.get(`${environment.apiUrl}/clientes/empresa/${idEmpresa}`, this.headersService.getHeaders());
  }

  createCliente(cliente: Cliente) {
    cliente.idEmpresa = this.empleadosService.idEmpresa;
    return this.http.post(`${environment.apiUrl}/clientes`, cliente, this.headersService.getHeaders());
  }
}
