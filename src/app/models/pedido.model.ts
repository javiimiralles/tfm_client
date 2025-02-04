import {EstadoPedidoEnum} from '../../../../../../../../../Desktop/enums/estado-pedido.enum';
import {TipoPedidoEnum} from '../../../../../../../../../Desktop/enums/tipo-pedido.enum';
import {MetodoPagoEnum} from '../../../../../../../../../Desktop/enums/metodo-pago.enum';

export class Pedido {
  constructor(
    public id?: number,
    public idCliente?: number,
    public idEmpresa?: number,
    public fechaPedido?: Date,
    public estado?: EstadoPedidoEnum | string,
    public tipo?: TipoPedidoEnum | string,
    public fechaActualizacion?: Date,
    public metodoPago?: MetodoPagoEnum | string,
    public costeTotal?: number,
    public observaciones?: string
  ) {
  }
}
