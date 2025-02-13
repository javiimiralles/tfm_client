export class EmpleadoFilter {
  constructor(
    public id?: number,
    public idEmpresa?: number,
    public idUsuario?: number,
    public nombre?: string,
    public apellidos?: string,
    public activo?: boolean,
    public query?: string,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {}

}
