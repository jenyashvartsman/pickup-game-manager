import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Player,
  PlayerStat,
  CreatePlayerRequest,
  UpdatePlayerRequest,
} from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/players`;

  readonly players = signal<Player[]>([]);
  readonly isLoading = signal<boolean>(false);

  loadPlayers(): void {
    this.isLoading.set(true);
    this.http.get<Player[]>(this.baseUrl).subscribe({
      next: (players) => {
        this.players.set(players);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  getPlayer(id: string): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/${id}`);
  }

  getPlayerStats(id: string): Observable<PlayerStat[]> {
    return this.http.get<PlayerStat[]>(`${this.baseUrl}/${id}/stats`);
  }

  createPlayer(data: CreatePlayerRequest): Observable<Player> {
    return this.http.post<Player>(this.baseUrl, data).pipe(
      tap((player) => {
        this.players.update((list) => [...list, player]);
      })
    );
  }

  updatePlayer(id: string, data: UpdatePlayerRequest): Observable<Player> {
    return this.http.patch<Player>(`${this.baseUrl}/${id}`, data).pipe(
      tap((updated) => {
        this.players.update((list) =>
          list.map((p) => (p.id === id ? updated : p))
        );
      })
    );
  }

  deletePlayer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.players.update((list) => list.filter((p) => p.id !== id));
      })
    );
  }
}
