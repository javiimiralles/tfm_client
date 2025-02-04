export class Producto {
  constructor(
    public id?: number,
    public idCategoria?: number,
    public idEmpresa?: number,
    public nombre?: string,
    public descripcion?: string,
    public imagen?: string,
    public precioVenta?: number,
    public impuestoVenta?: number,
    public coste?: number,
    public impuestoCompra?: number,
    public stock?: number,
    public idRespAlta?: number,
    public fechaAlta?: Date,
    public idRespModif?: number,
    public fechaModif?: Date,
    public idRespBaja?: number,
    public fechaBaja?: Date,
  ) {
  }
}
