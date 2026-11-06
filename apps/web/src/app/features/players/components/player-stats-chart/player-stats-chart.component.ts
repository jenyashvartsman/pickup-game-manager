import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { PlayerStat } from '../../models/player.model';

Chart.register(...registerables);

@Component({
  selector: 'app-player-stats-chart',
  templateUrl: './player-stats-chart.component.html',
  styleUrl: './player-stats-chart.component.scss',
})
export class PlayerStatsChartComponent implements AfterViewInit, OnDestroy {
  stats = input.required<PlayerStat[]>();

  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private viewInitialized = false;

  constructor() {
    effect(() => {
      const data = this.stats();
      if (this.viewInitialized) {
        this.renderChart(data);
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.renderChart(this.stats());
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(stats: PlayerStat[]): void {
    this.chart?.destroy();

    if (stats.length === 0) return;

    const labels = stats.map((s) =>
      new Date(s.gameScheduledAt).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      })
    );

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Goals',
            data: stats.map((s) => s.goals),
            backgroundColor: 'rgba(0, 212, 170, 0.8)',
            borderColor: 'rgba(0, 212, 170, 1)',
            borderWidth: 1,
          },
          {
            label: 'Assists',
            data: stats.map((s) => s.assists),
            backgroundColor: 'rgba(9, 105, 218, 0.8)',
            borderColor: 'rgba(9, 105, 218, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'var(--color-text)',
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'var(--color-border)' },
            ticks: { color: 'var(--color-text-muted)' },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: 'var(--color-text-muted)',
            },
            grid: { color: 'var(--color-border)' },
          },
        },
      },
    };

    this.chart = new Chart(this.canvasRef.nativeElement, config);
  }
}
