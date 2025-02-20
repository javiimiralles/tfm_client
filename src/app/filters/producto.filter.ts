export class ProductoFilter {
    constructor(
        public id?: number,
        public idCategoria?: number,
        public idEmpresa?: number,
        public nombre?: string,
        public descripcion?: string,
        public precioVenta?: number,
        public stock?: number,
        public query?: string,
        public page?: number,
        public size?: number,
        public sortBy?: string,
        public sortDirection?: string
    ) {}
}
