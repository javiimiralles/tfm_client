export class DashboardSummary {
  constructor(
    public totalFacturado?: number,
    public gastosPedidosProveedores?: number,
    public ventasEnCurso?: number,
    public clientesNuevos?: number,
    public pedidosProveedores?: number,
  ) {}
}
