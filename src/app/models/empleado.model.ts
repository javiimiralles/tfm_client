import { GeneroEnum } from "../enums/genero.enum";
import {Pais} from './pais.model';

export class Empleado {
  constructor(
    public id?: number,
    public idEmpresa?: number,
    public idUsuario?: number,
    public nombre?: string,
    public apellidos?: string,
    public nif?: string,
    public telefono?: string,
    public direccion?: string,
    public pais?: Pais,
    public provincia?: string,
    public poblacion?: string,
    public codigoPostal?: string,
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
