export class FacturaFilter {
    constructor(
        public idPedido?: number,
        public idEmpresa?: number,
        public fechaFactura?: Date,
        public importe?: number,
        public numeroFactura?: string,
        public query?: string,
        public page?: number,
        public size?: number,
        public sortBy?: string,
        public sortDirection?: string
    ) {}
}
