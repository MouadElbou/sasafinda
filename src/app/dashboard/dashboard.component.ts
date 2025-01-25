import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgChartsModule } from 'ng2-charts';
import { IpcService } from '../services/ipc.service';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatGridListModule,
    NgChartsModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <div class="content">
      <div class="stats-container">
        <mat-card class="stat-card glass-effect">
          <div class="stat-icon-container">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{dashboardStats.todayRevenue}} DH</span>
            <span class="stat-label">{{ 'dashboard.todayRevenue' | translate }}</span>
          </div>
        </mat-card>

        <mat-card class="stat-card glass-effect">
          <div class="stat-icon-container">
            <mat-icon>print</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{dashboardStats.activeOrders}}</span>
            <span class="stat-label">{{ 'dashboard.activeOrders' | translate }}</span>
          </div>
        </mat-card>

        <mat-card class="stat-card glass-effect">
          <div class="stat-icon-container">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{dashboardStats.totalCustomers}}</span>
            <span class="stat-label">{{ 'dashboard.totalCustomers' | translate }}</span>
          </div>
        </mat-card>
      </div>

      <mat-card class="revenue-chart-card glass-effect">
        <mat-card-header>
          <mat-card-title>{{ 'dashboard.revenueTrend' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas baseChart
            [data]="revenueData"
            [options]="chartOptions"
            [type]="'line'">
          </canvas>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .content {
      padding: 24px;
      position: relative;
      z-index: 1;
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      border-radius: 12px;
    }

    .revenue-chart-card {
      padding: 24px;
      border-radius: 12px;
    }

    .stat-icon-container {
      background: rgba(255, 193, 7, 0.1);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-container mat-icon {
      color: #FFC107;
      font-size: 24px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      text-align: center;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .revenue-chart-card mat-card-title {
      color: #333;
      font-size: 18px;
      margin-bottom: 24px;
    }

    .dashboard-card {
      background-color: var(--card-background);
      color: var(--text-color);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .dark-theme .dashboard-card {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .card-content,
    .card-title,
    .card-subtitle {
      color: var(--text-color);
    }
  `]})
export class DashboardComponent implements OnInit {
  dashboardStats = {
    todayRevenue: 0,
    activeOrders: 0,
    totalCustomers: 0
  };

  revenueData: any = {
    labels: [],
    datasets: [{
      label: 'Revenue',
      data: [],
      fill: true,
      borderColor: '#FFC107',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#FFC107',
      pointBorderColor: '#FFC107',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#FFC107'
    }]  };


  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} MAD`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          stepSize: 1000
        }
      },
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM dd'
          },
          tooltipFormat: 'PP'
        },
        grid: {
          display: false
        },
        ticks: {
          display: true,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    }
  };    constructor(private readonly ipc: IpcService) {}

  async ngOnInit() {
    await this.loadDashboardData();
}
async loadDashboardData() {
    this.dashboardStats = await this.ipc.getDashboardStats();
    const transactions = await this.ipc.getCashDeskTransactions();

    const dailyNetRevenue: { [key: string]: number } = {};
    let cumulativeBalance = 0;


    // Convert timestamps to date strings and sort transactions
    const processedTransactions = transactions
        .sort((a: { transaction_date: number }, b: { transaction_date: number }) => 
            a.transaction_date - b.transaction_date)
        .map((t: { transaction_date: number }) => ({
            ...t,
            dateStr: new Date(t.transaction_date).toLocaleDateString('en-CA') // This will ensure YYYY-MM-DD format with proper timezone handling
        }));

    // Get date range
    const startDate = new Date(Math.min(...processedTransactions.map((t: { transaction_date: number }) => t.transaction_date)));
    const endDate = new Date(Math.max(...processedTransactions.map((t: { transaction_date: number }) => t.transaction_date)));

    // Process transactions
    processedTransactions.forEach((transaction: { amount: string | number; type: string; dateStr: string }) => {
        const amount = Number(transaction.amount);
        cumulativeBalance += transaction.type === 'income' ? amount : -amount;
        dailyNetRevenue[transaction.dateStr] = cumulativeBalance;

    });


    // Fill in all dates
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (!dailyNetRevenue[dateStr]) {
            const previousDate = new Date(d);
            previousDate.setDate(previousDate.getDate() - 1);
            const previousDateStr = previousDate.toISOString().split('T')[0];
            dailyNetRevenue[dateStr] = dailyNetRevenue[previousDateStr] || 0;
        }
    }

    const revenueData = Object.entries(dailyNetRevenue)
        .map(([date, balance]) => ({
            x: date,
            y: balance
        }))
        .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

    this.revenueData = {
        datasets: [{
            label: 'Cumulative Revenue',
            data: revenueData,
            fill: true,
            borderColor: '#FFC107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#FFC107',
            pointBorderColor: '#FFC107',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#FFC107'
        }]
    };

}}