import { EstadoPedidoEnum } from "../enums/estado-pedido.enum";
import { MetodoPagoEnum } from "../enums/metodo-pago.enum";
import { TipoPedidoEnum } from "../enums/tipo-pedido.enum";
import {Cliente} from './cliente.model';


export class Pedido {
  constructor(
    public id?: number,
    public cliente?: Cliente,
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
