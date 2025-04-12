import {Pedido} from './pedido.model';
import {Cliente} from './cliente.model';

export class Factura {
  constructor(
    public id?: number,
    public pedido?: Pedido,
    public idEmpresa?: number,
    public fechaFactura?: Date,
    public importe?: number,
    public numeroFactura?: string,
    public cliente?: Cliente,
    public fechaVencimiento?: Date,
  ) {
  }
}
