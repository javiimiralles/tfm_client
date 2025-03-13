import {Rol} from './rol.model';
import {Accion} from './accion.model';

export class Permiso {
  constructor(
    public id?: number,
    public rol?: Rol,
    public accion?: Accion
  ) {
  }
}
