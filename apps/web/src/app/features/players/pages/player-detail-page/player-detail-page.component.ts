import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../services/players.service';
import {
  Player,
  PlayerStat,
  computeCareerTotals,
} from '../../models/player.model';
import { PlayerHistoryTableComponent } from '../../components/player-history-table/player-history-table.component';
import { PlayerStatsChartComponent } from '../../components/player-stats-chart/player-stats-chart.component';

@Component({
  selector: 'app-player-detail-page',
  imports: [PlayerHistoryTableComponent, PlayerStatsChartComponent],
  templateUrl: './player-detail-page.component.html',
  styleUrl: './player-detail-page.component.scss',
})
export class PlayerDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playersService = inject(PlayersService);

  protected readonly player = signal<Player | null>(null);
  protected readonly stats = signal<PlayerStat[]>([]);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly careerTotals = computed(() =>
    computeCareerTotals(this.stats())
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadPlayerAndStats(id);
  }

  private loadPlayerAndStats(id: string): void {
    this.isLoading.set(true);
    this.playersService.getPlayer(id).subscribe({
      next: (player) => {
        this.player.set(player);
        this.playersService.getPlayerStats(id).subscribe({
          next: (stats) => {
            this.stats.set(stats);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected onBack(): void {
    this.router.navigate(['/players']);
  }
}
