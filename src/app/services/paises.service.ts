import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(private http: HttpClient, private headersService: HeadersService) { }

  getPaises() {
    return this.http.get(`${environment.apiUrl}/paises`, this.headersService.getHeaders());
  }
}
