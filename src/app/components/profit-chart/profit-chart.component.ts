import {Component, Input, ViewChild} from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexGrid,
} from "ng-apexcharts";
import { DashboardIncomesExpenses } from '../../models/dashboard-incomes-expenses.model';
import { NgClass } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  grid: ApexGrid;
};

@Component({
  selector: 'app-profit-chart',
  imports: [ NgApexchartsModule, NgClass],
  templateUrl: './profit-chart.component.html',
  standalone: true,
  styleUrl: './profit-chart.component.css'
})
export class ProfitChartComponent {

  @ViewChild("chart") chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  ultimos6Meses: string[] = [];
  loading: boolean = true;
  private _incomesAndExpenses: DashboardIncomesExpenses;

  @Input() set incomesAndExpenses(value: DashboardIncomesExpenses) {
    this._incomesAndExpenses = value;
    if (value) {
      this.loadChartOptions();
    }
  }

  get incomesAndExpenses() {
    return this._incomesAndExpenses;
  }

  constructor() {
    this.ultimos6Meses = this.getUltimos6Meses();
  }

  private getUltimos6Meses() {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const hoy = new Date();
    const resultado: string[] = [];

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      resultado.push(meses[fecha.getMonth()]);
    }

    return resultado;
  }

  private loadChartOptions() {
    this.loading = true;
    this.chartOptions = {
      series: [
        {
          name: "Ingresos",
          color: "#31C48D",
          data: this.incomesAndExpenses.ingresosUltimos6Meses
        },
        {
          name: "Gastos",
          data: this.incomesAndExpenses.gastosUltimos6Meses,
          color: "#F05252",
        }
      ],
      chart: {
        sparkline: {
          enabled: false,
        },
        type: "bar",
        width: "100%",
        height: 400,
        toolbar: {
          show: false,
        }
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "100%",
          borderRadiusApplication: "end",
          borderRadius: 6,
          dataLabels: {
            position: "top",
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          },
          formatter: function(value) {
            return "$" + value
          }
        },
        categories: this.ultimos6Meses,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          }
        }
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -20
        },
      },
    }
    this.loading = false;
  }

}
