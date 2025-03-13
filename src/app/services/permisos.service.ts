import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
  ) { }

  getPermisosByRol(idRol: number) {
    return this.http.get(`${environment.apiUrl}/permisos/rol/${idRol}`, this.headersService.getHeaders());
  }
}
