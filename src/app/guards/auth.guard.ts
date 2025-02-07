import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const usuariosService = inject(UsuariosService);
  const router = inject(Router);

  return usuariosService.validateToken()
    .pipe(
      tap(isValid => {
        if (!isValid) {
          router.navigate(['/auth/login']);
        }
      })
    );
};
