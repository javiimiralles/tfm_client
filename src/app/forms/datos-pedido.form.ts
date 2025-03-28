import {MetodoPagoEnum} from '../enums/metodo-pago.enum';
import {DetallePedido} from '../models/detalle-pedido.model';

export class DatosPedidoForm {
  constructor(
    public idEmpresa?: number,
    public idCliente?: number,
    public metodoPago?: MetodoPagoEnum | string,
    public observaciones?: string,
    public detallesPedido?: DetallePedido[],
  ) {
  }
}
