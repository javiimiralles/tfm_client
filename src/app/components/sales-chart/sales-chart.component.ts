import { Component, Input, ViewChild } from '@angular/core';
import { getUltimos6Meses } from '../../utils/date.util';
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
import { RouterLink } from '@angular/router';

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
  selector: 'app-sales-chart',
  imports: [NgApexchartsModule, RouterLink],
  templateUrl: './sales-chart.component.html',
  styleUrl: './sales-chart.component.css'
})
export class SalesChartComponent {

  @ViewChild("chart") chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  ultimos6Meses: string[] = [];
  private _sales: number[] = [0, 0, 0, 0, 0, 0];
  totalSales: number = 0;

  @Input() set sales(value: number[]) {
    this._sales = value;
    if (value && value.length > 0) {
      this.loadChartOptions();
      this.totalSales = value.reduce((acc, curr) => acc + curr, 0);
    }
  }

  get sales() {
    return this._sales;
  }

  constructor() {
    this.ultimos6Meses = getUltimos6Meses();
  }

  private loadChartOptions() {
    this.chartOptions = {
      chart: {
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
      },
      series: [
        {
          name: "Ventas",
          data: this.sales,
          color: "#1A56DB",
        },
      ],
      legend: {
        show: false
      },
      xaxis: {
        categories: this.ultimos6Meses,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          }
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
      },
    }

  }

}
