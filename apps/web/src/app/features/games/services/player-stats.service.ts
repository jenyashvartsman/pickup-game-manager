import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PlayerStat,
  UpsertPlayerStatRequest,
} from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class PlayerStatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/games`;

  readonly stats = signal<PlayerStat[]>([]);
  readonly isLoading = signal<boolean>(false);

  loadStats(gameId: string): void {
    this.isLoading.set(true);
    this.http.get<PlayerStat[]>(`${this.baseUrl}/${gameId}/stats`).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  upsertStats(
    gameId: string,
    stats: UpsertPlayerStatRequest[]
  ): Observable<PlayerStat[]> {
    return this.http
      .put<PlayerStat[]>(`${this.baseUrl}/${gameId}/stats`, stats)
      .pipe(tap((updated) => this.stats.set(updated)));
  }
}
