import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BlogService, Blog, BlogStatistics } from '../blog.service';
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

// Type for axis charts (e.g., bar and line charts)
export type AxisChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-blog-statistics',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './blog-statistics.component.html',
  styleUrls: ['./blog-statistics.component.scss']
})
export class BlogStatisticsComponent implements OnInit {
  statistics: BlogStatistics | null = null;
  blogs: Blog[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Bar chart options for blogs by type (NEWS vs. ARTICLE)
  public barChartOptions: Partial<AxisChartOptions> = {
    series: [],
    chart: {
      type: 'bar',
      height: 350
    },
    title: {
      text: 'Blogs by Type',
      align: 'center'
    },
    xaxis: {
      title: {
        text: 'Blog Type'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Blogs'
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  // Pie chart options for likes by blog type
  public pieChartOptions: Partial<NonAxisChartOptions> = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    title: {
      text: 'Likes by Blog Type',
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

  // Line chart options for blogs published over time
  public lineChartOptions: Partial<AxisChartOptions> = {
    series: [],
    chart: {
      type: 'line',
      height: 350
    },
    title: {
      text: 'Blogs Published Over Time',
      align: 'center'
    },
    xaxis: {
      title: {
        text: 'Month'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Blogs'
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadBlogs();
  }

  loadStatistics(): void {
    this.loading = true;
    this.error = null;

    this.blogService.getBlogStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load statistics: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data.filter(blog => blog.published === true);
        this.updateCharts();
      },
      error: (err) => {
        this.error = 'Failed to load blogs: ' + err.message;
        this.loading = false;
      }
    });
  }

  updateCharts(): void {
    // Update Bar Chart (Blogs by Type)
    const newsCount = this.blogs.filter(blog => blog.type === 'NEWS').length;
    const articleCount = this.blogs.filter(blog => blog.type === 'ARTICLE').length;
    this.barChartOptions.series = [
      {
        name: 'Blogs',
        data: [newsCount, articleCount]
      }
    ];
    this.barChartOptions.xaxis = {
      ...this.barChartOptions.xaxis!,
      categories: ['News', 'Article']
    };

    // Update Pie Chart (Likes by Blog Type)
    const newsLikes = this.blogs
      .filter(blog => blog.type === 'NEWS')
      .reduce((sum, blog) => sum + (blog.likes || 0), 0);
    const articleLikes = this.blogs
      .filter(blog => blog.type === 'ARTICLE')
      .reduce((sum, blog) => sum + (blog.likes || 0), 0);
    this.pieChartOptions.series = [newsLikes, articleLikes];
    this.pieChartOptions.labels = ['News', 'Article'];

    // Update Line Chart (Blogs Published Over Time)
    const blogsByMonth = this.groupBlogsByMonth();
    this.lineChartOptions.series = [
      {
        name: 'Blogs',
        data: Object.values(blogsByMonth)
      }
    ];
    this.lineChartOptions.xaxis = {
      ...this.lineChartOptions.xaxis!,
      categories: Object.keys(blogsByMonth)
    };
  }

  groupBlogsByMonth(): { [key: string]: number } {
    const blogsByMonth: { [key: string]: number } = {};
    this.blogs.forEach(blog => {
      if (blog.createdAt) {
        const date = new Date(blog.createdAt);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // e.g., "2025-04"
        blogsByMonth[monthYear] = (blogsByMonth[monthYear] || 0) + 1;
      }
    });
    // Sort the months
    const sortedKeys = Object.keys(blogsByMonth).sort();
    const sortedBlogsByMonth: { [key: string]: number } = {};
    sortedKeys.forEach(key => {
      sortedBlogsByMonth[key] = blogsByMonth[key];
    });
    return sortedBlogsByMonth;
  }
}