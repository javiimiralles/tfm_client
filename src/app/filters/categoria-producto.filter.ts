export class CategoriaProductoFilter {
  constructor(
    public idEmpresa?: number,
    public query?: string,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {}
}
