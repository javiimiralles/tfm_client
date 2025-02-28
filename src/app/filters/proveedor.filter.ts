export class ProveedorFilter {
  constructor(
    public idEmpresa?: number,
    public nombre?: string,
    public email?: string,
    public query?: string,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {
  }
}
