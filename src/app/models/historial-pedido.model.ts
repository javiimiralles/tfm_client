import {EstadoPedidoEnum} from '../enums/estado-pedido.enum';

export class HistorialPedido {
  constructor(
    public id?: number,
    public idPedido?: number,
    public estadoAnterior?: EstadoPedidoEnum | string,
    public estadoNuevo?: EstadoPedidoEnum | string,
    public idRespModif?: number,
    public fechaModif?: Date
  ) {
  }
}
