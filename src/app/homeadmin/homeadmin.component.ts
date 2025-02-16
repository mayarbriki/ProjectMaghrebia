import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProductadminComponent } from '../productadmin/productadmin.component';

@Component({
  standalone: true,
  selector: 'app-homeadmin',
  imports:[SidebarComponent,ProductadminComponent],
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent implements OnInit {

  public canvas: any;
  public ctx: any;
  public chartColor: any;
  public chartEmail: any;
  public chartHours: any;

  ngOnInit() {
    this.chartColor = "#FFFFFF";

    this.canvas = document.getElementById("chartHours") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.chartHours = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [
          {
            borderColor: "#6bd098",
            backgroundColor: "#6bd098",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
          },
          {
            borderColor: "#f17e5d",
            backgroundColor: "#f17e5d",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420]
          },
          {
            borderColor: "#fcc468",
            backgroundColor: "#fcc468",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [370, 394, 415, 409, 425, 445, 460, 450, 478, 484]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: "#9f9f9f",
              maxTicksLimit: 5
            },
            grid: {
              display: false, // Hide the grid lines
              color: 'rgba(255,255,255,0.05)'
            }
          },
          x: {
            ticks: {
              color: "#9f9f9f",
              padding: 20
            },
            grid: {
              display: false, // Hide the grid lines
              color: 'rgba(255,255,255,0.1)'
            }
          }
        }
      }
    });
  }
}
