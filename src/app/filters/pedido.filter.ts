import {EstadoPedidoEnum} from '../enums/estado-pedido.enum';
import {TipoPedidoEnum} from '../enums/tipo-pedido.enum';
import {MetodoPagoEnum} from '../enums/metodo-pago.enum';

export class PedidoFilter {
  constructor(
    public idCliente?: number,
    public idEmpresa?: number,
    public fechaPedido?: Date,
    public estado?: EstadoPedidoEnum,
    public tipo?: TipoPedidoEnum,
    public metodoPago?: MetodoPagoEnum,
    public costeTotal?: number,
    public observaciones?: string,
    public query?: string,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {
  }
}
