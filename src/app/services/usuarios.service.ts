import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginFormInterface } from '../interfaces/login-form.interface';
import {catchError, forkJoin, map, of, switchMap, tap} from 'rxjs';
import { environment } from '../../environments/environment';
import { HeadersService } from './headers.service';
import { EmpleadosService } from './empleados.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private headersService: HeadersService,
    private empleadosService: EmpleadosService
  ) { }

  login(loginForm: LoginFormInterface) {
    return this.http.post(`${environment.apiUrl}/auth/login`, loginForm, this.headersService.getHeaders())
      .pipe(
        tap(res => {
          const idUsuario = res['id'];
          if (idUsuario) {
            localStorage.setItem('token', res['token'] as string);
            this.usuario = new Usuario(res['id']);
          }
        })
      )
  }

  logout() {
    this.cleanLocalStorage();
    this.router.navigate(['/login']);
  }

  validateToken() {
    return this.validate(true, false);
  }

  validateNoToken() {
    return this.validate(false, true);
  }

  private validate(correcto: boolean, incorrecto: boolean) {
    if (this.token === '') {
      this.cleanLocalStorage();
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
        this.cleanLocalStorage();
        return of(incorrecto);
      })
    );
  }

  private cleanLocalStorage() {
    localStorage.removeItem('token');
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
