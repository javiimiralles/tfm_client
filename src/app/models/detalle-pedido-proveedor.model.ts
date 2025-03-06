import {Producto} from './producto.model';

export class DetallePedidoProveedor {
  constructor(
    public id?: number,
    public idPedidoProveedor?: number,
    public producto?: Producto,
    public cantidad?: number,
    public precioUnitario?: number,
    public subtotal?: number
  ) {}
}
