import { EstadoPedidoEnum } from "../enums/estado-pedido.enum";
import { MetodoPagoEnum } from "../enums/metodo-pago.enum";
import { TipoPedidoEnum } from "../enums/tipo-pedido.enum";


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
