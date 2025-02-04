import {MetodoPagoEnum} from '../../../../../../../../../Desktop/enums/metodo-pago.enum';

export class Pago {
  constructor(
    public id?: number,
    public idPedido?: number,
    public idEmpresa?: number,
    public fechaPago?: Date,
    public importe?: number,
    public metodoPago?: MetodoPagoEnum | string
  ) {}
}
