import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {EmpleadosService} from './empleados.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly http: HttpClient,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService
  ) { }

  getDashboardSummary() {
    const idEmpresa = this.empleadosService.idEmpresa;
    return this.http.get(`${environment.apiUrl}/dashboard/summary/${idEmpresa}`, this.headersService.getHeaders());
  }

  getDashboardIcomesAndExpenses() {
    const idEmpresa = this.empleadosService.idEmpresa;
    return this.http.get(`${environment.apiUrl}/dashboard/incomes-expenses/${idEmpresa}`, this.headersService.getHeaders());
  }
}
