import { EstadoPedidoProveedorEnum } from "../enums/estado-pedido-proveedor.enum";
import {Proveedor} from './proveedor.model';

export class PedidoProveedor {
    constructor(
        public id?: number,
        public proveedor?: Proveedor,
        public idEmpresa?: number,
        public fechaPedido?: Date,
        public estado?: EstadoPedidoProveedorEnum | string,
        public costeTotal?: number
    ) {
    }
}
