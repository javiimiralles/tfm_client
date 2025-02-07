export class Cliente {
  constructor(
    public id?: number,
    public idEmpresa?: number,
    public nombre?: string,
    public apellidos?: string,
    public email?: string,
    public telefono?: string,
    public direccion?: string,
    public idRespAlta?: number,
    public fechaAlta?: Date,
    public idRespModif?: number,
    public fechaModif?: Date,
    public idRespBaja?: number,
    public fechaBaja?: Date,
  ) {}
}
