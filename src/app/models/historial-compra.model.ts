export class HistorialCompra {
  constructor(
    public id?: number,
    public idPedido?: number,
    public idCliente?: number,
    public fechaCompra?: Date,
    public importe?: number
  ) {}
}
