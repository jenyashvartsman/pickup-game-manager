import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { GameResultService } from '../../services/game-result.service';
import { PlayerStatsService } from '../../services/player-stats.service';
import { PlayersService } from '../../../players/services/players.service';
import {
  CreateGameResultRequest,
  GameDetail,
  UpsertPlayerStatRequest,
} from '../../models/game.model';
import { RosterListComponent } from '../../components/roster-list/roster-list.component';
import { GameResultFormComponent } from '../../components/game-result-form/game-result-form.component';
import { PlayerStatsFormComponent } from '../../components/player-stats-form/player-stats-form.component';

@Component({
  selector: 'app-game-detail-page',
  imports: [RosterListComponent, GameResultFormComponent, PlayerStatsFormComponent],
  templateUrl: './game-detail-page.component.html',
  styleUrl: './game-detail-page.component.scss',
})
export class GameDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gamesService = inject(GamesService);
  private readonly gameResultService = inject(GameResultService);
  private readonly playerStatsService = inject(PlayerStatsService);
  private readonly playersService = inject(PlayersService);

  protected readonly game = signal<GameDetail | null>(null);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly result = this.gameResultService.result;
  protected readonly stats = this.playerStatsService.stats;
  protected readonly allPlayers = this.playersService.players;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadGame(id);
    this.playersService.loadPlayers();
  }

  private loadGame(id: string): void {
    this.isLoading.set(true);
    this.gamesService.getGame(id).subscribe({
      next: (game) => {
        this.game.set(game);
        this.isLoading.set(false);
        if (game.status === 'completed') {
          this.gameResultService.loadResult(id);
          this.playerStatsService.loadStats(id);
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected onAddToRoster(playerId: string): void {
    const current = this.game();
    if (!current) return;
    this.gamesService.addToRoster(current.id, playerId).subscribe({
      next: (updated) => this.game.set(updated),
    });
  }

  protected onRemoveFromRoster(playerId: string): void {
    const current = this.game();
    if (!current) return;
    this.gamesService.removeFromRoster(current.id, playerId).subscribe({
      next: () => {
        this.game.set({
          ...current,
          players: current.players.filter((p) => p.id !== playerId),
        });
      },
    });
  }

  protected onResultSubmit(data: CreateGameResultRequest): void {
    const current = this.game();
    if (!current) return;
    this.gameResultService.createResult(current.id, data).subscribe({
      next: () => {
        this.game.set({ ...current, status: 'completed' });
        this.playerStatsService.loadStats(current.id);
      },
    });
  }

  protected onStatsSubmit(stats: UpsertPlayerStatRequest[]): void {
    const current = this.game();
    if (!current) return;
    this.playerStatsService.upsertStats(current.id, stats).subscribe();
  }

  protected onBack(): void {
    this.router.navigate(['/games']);
  }

  protected formatDateTime(isoString: string): string {
    return new Date(isoString).toLocaleString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
