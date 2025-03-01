import {Producto} from '../models/producto.model';
import {Proveedor} from '../models/proveedor.model';

export interface ItemCestaInterface {
  producto: Producto,
  proveedor: Proveedor,
  cantidad: number
}
