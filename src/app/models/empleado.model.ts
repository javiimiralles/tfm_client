import {GeneroEnum} from '../../../../../../../../../Desktop/enums/genero.enum';

export class Empleado {
  constructor(
    public id?: number,
    public idEmpresa?: number,
    public idUsuario?: number,
    public nombre?: string,
    public apellidos?: string,
    public telefono?: string,
    public direccion?: string,
    public fechaNacimiento?: Date,
    public genero?: GeneroEnum | string,
    public idRespAlta?: number,
    public fechaAlta?: Date,
    public idRespModif?: number,
    public fechaModif?: Date,
    public idRespBaja?: number,
    public fechaBaja?: Date
  ) {
  }
}
