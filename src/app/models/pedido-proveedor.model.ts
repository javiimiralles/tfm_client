import { EstadoPedidoProveedorEnum } from "../enums/estado-pedido-proveedor.enum";

export class PedidoProveedor {
    constructor(
        public id?: number,
        public idProveedor?: number,
        public idEmpresa?: number,
        public fechaPedido?: Date,
        public estado?: EstadoPedidoProveedorEnum | string,
        public costeTotal?: number
    ) {
    }
}
