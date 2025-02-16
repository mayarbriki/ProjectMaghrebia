// angular import
import { Component, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/demo/shared/shared.module';
import { ChartDB } from 'src/app/fake-data/chartDB';

// third party
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent {
  chart = viewChild<ChartComponent>('chart');

  // New charts focused on user management
  totalUsersChart: Partial<ApexOptions>;
  userGrowthChart: Partial<ApexOptions>;
  activeUsersChart: Partial<ApexOptions>;
  userRolesChart: Partial<ApexOptions>;
  loginTrendsChart: Partial<ApexOptions>;
  accountStatusChart: Partial<ApexOptions>;

  roleColors = ['#4680FF', '#E58A00', '#2CA87F', '#b5ccff'];
  @ViewChild(MatMenu) menu!: MatMenu;

  constructor() {
    this.totalUsersChart = {
      chart: { type: 'line' },
      series: [{ name: 'Total Users', data: [120, 200, 320, 450, 600, 780, 950] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      colors: ['#4680FF']
    };

    this.userGrowthChart = {
      chart: { type: 'bar' },
      series: [{ name: 'Growth Rate', data: [5, 8, 12, 15, 20, 25, 30] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      colors: ['#2CA87F']
    };

    this.activeUsersChart = {
      chart: { type: 'pie' },
      series: [80, 20],
      labels: ['Active Users', 'Inactive Users'],
      colors: ['#2CA87F', '#E58A00']
    };

    this.userRolesChart = {
      chart: { type: 'donut' },
      series: [5, 50, 10, 15],
      labels: ['Admins', 'Clients', 'Full-Time Users', 'Job Appliers'],
      colors: this.roleColors
    };

    this.loginTrendsChart = {
      chart: { type: 'area' },
      series: [
        { name: 'Logins', data: [50, 80, 120, 150, 200, 250, 300] },
        { name: 'Sign-ups', data: [20, 40, 60, 80, 100, 130, 150] }
      ],
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      colors: ['#4680FF', '#E58A00']
    };

    this.accountStatusChart = {
      chart: { type: 'pie' },
      series: [400, 80, 20],
      labels: ['Verified', 'Pending', 'Suspended'],
      colors: ['#2CA87F', '#E58A00', '#DC2626']
    };
  }

  user_roles = [
    {
      background: 'bg-primary-500',
      item: 'Admins',
      value: '5',
      number: '+1 new'
    },
    {
      background: 'bg-warning-500',
      item: 'Clients',
      value: '50',
      number: '+5 new'
    },
    {
      background: 'bg-success-500',
      item: 'Full-Time Job Users',
      value: '10',
      number: '+2 new'
    },
    {
      background: 'bg-info-500',
      item: 'Job Appliers',
      value: '15',
      number: '+3 new'
    }
  ];
}
