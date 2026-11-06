import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../services/players.service';
import {
  Player,
  PlayerCareerTotals,
  PlayerStat,
  computeCareerTotals,
} from '../../models/player.model';
import { PlayerHistoryTableComponent } from '../../components/player-history-table/player-history-table.component';
import { PlayerStatsChartComponent } from '../../components/player-stats-chart/player-stats-chart.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card.component';
import { AnimationService } from '../../../../core/services/animation.service';
import gsap from 'gsap';

const ZERO_TOTALS: PlayerCareerTotals = {
  gamesPlayed: 0,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  minutesPlayed: 0,
};

@Component({
  selector: 'app-player-detail-page',
  imports: [PlayerHistoryTableComponent, PlayerStatsChartComponent, EmptyStateComponent, SkeletonCardComponent],
  templateUrl: './player-detail-page.component.html',
  styleUrl: './player-detail-page.component.scss',
})
export class PlayerDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playersService = inject(PlayersService);
  private readonly animationService = inject(AnimationService);
  private activeTween: gsap.core.Tween | null = null;

  protected readonly player = signal<Player | null>(null);
  protected readonly stats = signal<PlayerStat[]>([]);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly careerTotals = computed(() =>
    computeCareerTotals(this.stats())
  );

  /** Animated display values — GSAP tweens this; the template binds to displayTotals, not careerTotals. */
  protected readonly displayTotals = signal<PlayerCareerTotals>({ ...ZERO_TOTALS });

  constructor() {
    effect(() => {
      const totals = this.careerTotals();
      const loading = this.isLoading();
      if (loading) return;

      if (this.animationService.prefersReducedMotion()) {
        this.displayTotals.set(totals);
        return;
      }

      this.activeTween?.kill();
      const proxy = { ...ZERO_TOTALS };
      this.activeTween = gsap.to(proxy, {
        gamesPlayed: totals.gamesPlayed,
        goals: totals.goals,
        assists: totals.assists,
        yellowCards: totals.yellowCards,
        redCards: totals.redCards,
        minutesPlayed: totals.minutesPlayed,
        duration: 0.4,
        ease: 'power1.out',
        onUpdate: () => {
          this.displayTotals.set({
            gamesPlayed: Math.round(proxy.gamesPlayed),
            goals: Math.round(proxy.goals),
            assists: Math.round(proxy.assists),
            yellowCards: Math.round(proxy.yellowCards),
            redCards: Math.round(proxy.redCards),
            minutesPlayed: Math.round(proxy.minutesPlayed),
          });
        },
        onComplete: () => {
          // Guarantee exact final values after tween finishes
          this.displayTotals.set(totals);
        },
      });
    });
  }

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
