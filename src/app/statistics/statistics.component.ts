import { Component, OnInit } from '@angular/core';
import { ProductService, ProductStatistics } from '../product.service';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexAxisChartSeries
} from 'ng-apexcharts';

// Type for non-axis charts (e.g., pie chart)
export type NonAxisChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

// Type for axis charts (e.g., bar chart)
export type AxisChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  statistics: ProductStatistics | null = null;
  loading: boolean = true;
  error: string | null = null;

  // Bar chart options for products by category (axis chart)
  public barChartOptions: Partial<AxisChartOptions> = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    title: {
      text: 'Products by Category',
      align: 'center'
    },
    xaxis: {
      title: {
        text: 'Category'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Products'
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  // Pie chart options for views by category (non-axis chart)
  public pieChartOptions: Partial<NonAxisChartOptions> = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    title: {
      text: 'Views by Category',
      align: 'center'
    },
    labels: [],
    legend: {
      position: 'top'
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    dataLabels: {
      enabled: true
    }
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductStatistics().subscribe({
      next: (data) => {
        this.statistics = data;

        // Update bar chart (products by category)
        this.barChartOptions.series = [
          {
            name: 'Products',
            data: Object.values(data.productsByCategory) as number[]
          }
        ];
        this.barChartOptions.xaxis = {
          ...this.barChartOptions.xaxis!,
          categories: Object.keys(data.productsByCategory)
        };

        // Update pie chart (views by category)
        this.pieChartOptions.series = Object.values(data.viewsByCategory) as number[];
        this.pieChartOptions.labels = Object.keys(data.viewsByCategory);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load statistics: ' + err.message;
        this.loading = false;
      }
    });
  }
}