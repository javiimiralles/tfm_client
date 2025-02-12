export class ClienteFilter {
  constructor(
    public id?: number,
    public idEmpresa?: number,
    public nombre?: string,
    public apellidos?: string,
    public email?: string,
    public fechaAlta?: Date,
    public query?: string,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {
  }
}
