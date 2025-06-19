export class DashboardIncomesExpenses {
  constructor(
    public totalIngresos?: number,
    public totalGastos?: number,
    public ratioBeneficio?: number,
    public ingresosUltimos6Meses?: number[],
    public gastosUltimos6Meses?: number[],
  ) {}
}
