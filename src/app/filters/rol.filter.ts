export class RolFilter {
  constructor(
    public idEmpresa?: number,
    public nombre?: string,
    public query?: string,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {
  }
}
