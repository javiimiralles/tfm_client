import {Pedido} from './pedido.model';

export class Factura {
  constructor(
    public id?: number,
    public pedido?: Pedido,
    public idEmpresa?: number,
    public fechaFactura?: Date,
    public importe?: number,
    public numeroFactura?: string
  ) {
  }
}
