import {EstadoPedidoProveedorEnum} from '../enums/estado-pedido-proveedor.enum';

export class PedidoProveedorFilter {
  constructor(
    public id?: number,
    public idProveedor?: number,
    public idEmpresa?: number,
    public fechaPedido?: Date,
    public estado?: EstadoPedidoProveedorEnum,
    public costeTotal?: number,
    public page?: number,
    public size?: number,
    public sortBy?: string,
    public sortDirection?: string
  ) {
  }
}
