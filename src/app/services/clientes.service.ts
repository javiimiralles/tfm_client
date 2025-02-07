import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient, private headersService: HeadersService) { }

  getClientesByEmpresa(idEmpresa: number) {
    return this.http.get(`${environment.apiUrl}/clientes/empresa/${idEmpresa}`, this.headersService.getHeaders());
  }
}
