import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginFormInterface } from '../interfaces/login-form.interface';
import {catchError, forkJoin, map, of, switchMap, tap} from 'rxjs';
import { environment } from '../../environments/environment';
import { HeadersService } from './headers.service';
import { EmpleadosService } from './empleados.service';
import { cleanLocalStorage } from '../utils/local-storage.util';
import {AlertsService} from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuario: Usuario;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly headersService: HeadersService,
    private readonly empleadosService: EmpleadosService,
    private readonly alertsService: AlertsService
  ) { }

  login(loginForm: LoginFormInterface) {
    return this.http.post(`${environment.apiUrl}/auth/login`, loginForm, this.headersService.getHeaders())
      .pipe(
        tap(res => {
          const idUsuario = res['data']?.id;
          if (idUsuario) {
            localStorage.setItem('token', res['token'] as string);
            this.usuario = new Usuario(res['id']);
          }
        })
      )
  }

  logout() {
    cleanLocalStorage();
    this.router.navigate(['/login']);
  }

  validateToken() {
    return this.validate(true, false);
  }

  validateNoToken() {
    return this.validate(false, true);
  }

  checkPermissions(permission: string): boolean {
    if (!this.hasPermission(permission)) {
      this.alertsService.showError('No tienes permisos para acceder a esta página');
      this.logout();
      return false;
    }
    return true;
  }

  hasPermission(permiso: string) {
    if (!this.permisos) return false;
    return this.permisos.includes(permiso);
  }

  private validate(correcto: boolean, incorrecto: boolean) {
    if (this.token === '') {
      cleanLocalStorage();
      return of(incorrecto);
    }

    const tokenRequest = this.http.get(`${environment.apiUrl}/auth/refresh-token`, this.headersService.getHeaders());
    const empleadoRequest = (id: number) => this.empleadosService.getEmpleadoByIdUsuario(id);

    return tokenRequest.pipe(
      switchMap((res: any) => {
        const { token, data: { id, email, rol, permisos } } = res;
        this.usuario = new Usuario(id, email, undefined, rol, permisos);
        localStorage.setItem('token', token);

        return forkJoin([
          of(correcto),
          empleadoRequest(id),
        ]);
      }),
      tap(([_, res]) => {
        this.empleadosService.setEmpleado(res['data']);
      }),
      map(([result]) => result),
      catchError(() => {
        cleanLocalStorage();
        return of(incorrecto);
      })
    );
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get id() {
    return this.usuario ? this.usuario.id : null;
  }

  get email() {
    return this.usuario ? this.usuario.email : null;
  }

  get rol() {
    return this.usuario ? this.usuario.rol : null;
  }

  get permisos() {
    return this.usuario ? this.usuario.permisos : null;
  }
}
