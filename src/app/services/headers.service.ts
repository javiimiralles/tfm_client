import {Injectable, Injector} from '@angular/core';
import {UsuariosService} from './usuarios.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  private usuariosService: UsuariosService;

  constructor(private injector: Injector) { }

  getHeaders() {
    if (!this.usuariosService) {
      this.usuariosService = this.injector.get(UsuariosService);
    }

    let idResponsable = '';

    if (this.usuariosService.id != null) {
      idResponsable = this.usuariosService.id
        ? this.usuariosService.id.toString()
        : '';
    }

    return {
      headers: {
        'x-token': localStorage.getItem('token') || '',
        'idResponsable': idResponsable,
        'Authorization': `Basic ${btoa(
          `${environment.apiUser}:${environment.apiPassword}`
        )}`,
      }
    };
  }
}
