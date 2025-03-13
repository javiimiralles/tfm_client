import {Accion} from '../models/accion.model';

export class RolForm {
  constructor(
    public idEmpresa?: number,
    public nombre?: string,
    public descripcion?: string,
    public acciones?: Accion[]
  ) {
  }
}
