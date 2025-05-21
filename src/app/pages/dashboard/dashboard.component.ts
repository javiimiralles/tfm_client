import {Component, OnInit} from '@angular/core';
import {InfoCardComponent} from '../../components/info-card/info-card.component';
import {DashboardService} from '../../services/dashboard.service';
import {AlertsService} from '../../services/alerts.service';
import {DashboardSummary} from '../../models/dashboard-summary.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    InfoCardComponent
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  dashboardSummary: DashboardSummary = new DashboardSummary();

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly alertsService: AlertsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }

  private loadDashboardSummary() {
    this.dashboardService.getDashboardSummary().subscribe({
      next: (res) => {
        this.dashboardSummary = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los datos', err);
      }
    })
  }


}
