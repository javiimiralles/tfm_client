import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginFormInterface } from '../interfaces/login-form.interface';
import { baseUrl } from '../common/base-url';
import { catchError, map, of, tap } from 'rxjs';
import { headers } from '../utils/headers.utils';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuario: Usuario;

  constructor(private http: HttpClient, private router: Router) { }

  login(loginForm: LoginFormInterface) {
    return this.http.post(`${baseUrl}/api/usuarios/login`, loginForm)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res['token'] as string);
          this.usuario = new Usuario(res['id']);
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

    return this.http.get(`${baseUrl}/login/token`, headers)
      .pipe(
        tap((res: any) => {
          const { token, id, email, password, idRol } = res;
          this.usuario = new Usuario(id, email, password, idRol);
          localStorage.setItem('token', token);
        }),
        map (res => {
          return correcto;
        }),
        catchError (err => {
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
    return this.usuario.id;
  }

  get email() {
    return this.usuario.email;
  }

  get password() {
    return this.usuario.password;
  }

  get idRol() {
    return this.usuario.idRol;
  }
}
