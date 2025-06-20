import {Component, OnInit} from '@angular/core';
import {InfoCardComponent} from '../../components/info-card/info-card.component';
import {DashboardService} from '../../services/dashboard.service';
import {AlertsService} from '../../services/alerts.service';
import {DashboardSummary} from '../../models/dashboard-summary.model';
import {ProfitChartComponent} from '../../components/profit-chart/profit-chart.component';
import { DashboardIncomesExpenses } from '../../models/dashboard-incomes-expenses.model';
import { SalesChartComponent } from "../../components/sales-chart/sales-chart.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    InfoCardComponent,
    ProfitChartComponent,
    SalesChartComponent
],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  loading = true;
  dashboardSummary: DashboardSummary = new DashboardSummary();
  icomesAndExpenses: DashboardIncomesExpenses = new DashboardIncomesExpenses();
  sales: number[] = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly alertsService: AlertsService
  ) {}

  ngOnInit(): void {
    Promise.all([
      this.dashboardService.getDashboardSummary().toPromise(),
      this.dashboardService.getDashboardIcomesAndExpenses().toPromise(),
      this.dashboardService.getDashboardSales().toPromise()
    ]).then(([summary, incomesExpenses, sales]) => {
      this.dashboardSummary = summary['data'];
      this.icomesAndExpenses = incomesExpenses['data'];
      this.sales = sales['data'];
      console.log('sales', this.sales);
      this.loading = false;
    }).catch(err => {
      this.alertsService.showError('Error al cargar los datos', err);
      this.loading = false;
    });
  }


}
