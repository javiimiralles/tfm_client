export class DetallePedidoProveedor {
  constructor(
    public id?: number,
    public idPedidoProveedor?: number,
    public idProducto?: number,
    public cantidad?: number,
    public precioUnitario?: number,
    public subtotal?: number
  ) {}
}
