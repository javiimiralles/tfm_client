import {Pais} from './pais.model';

export class Cliente {
  constructor(
    public id?: number,
    public idEmpresa?: number,
    public nombre?: string,
    public apellidos?: string,
    public nif?: string,
    public email?: string,
    public telefono?: string,
    public direccion?: string,
    public pais?: Pais | number,
    public provincia?: string,
    public poblacion?: string,
    public codigoPostal?: string,
    public idRespAlta?: number,
    public fechaAlta?: Date,
    public idRespModif?: number,
    public fechaModif?: Date,
    public idRespBaja?: number,
    public fechaBaja?: Date,
  ) {}
}
