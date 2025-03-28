import {Producto} from './producto.model';

export class DetallePedido {
  constructor(
    public id?: number,
    public idPedido?: number,
    public producto?: Producto,
    public cantidad?: number,
    public precioUnitario?: number,
    public subtotal?: number
  ) {
  }
}
