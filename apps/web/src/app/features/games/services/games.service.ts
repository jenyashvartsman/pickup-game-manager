import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Game,
  CreateGameRequest,
  UpdateGameRequest,
} from '../models/game.model';

export interface WeekRange {
  from: Date;
  to: Date;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Mon start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(start: Date): Date {
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/games`;

  readonly games = signal<Game[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedWeek = signal<Date>(startOfWeek(new Date()));

  readonly weekRange = computed<WeekRange>(() => ({
    from: this.selectedWeek(),
    to: endOfWeek(this.selectedWeek()),
  }));

  loadGamesForWeek(): void {
    const { from, to } = this.weekRange();
    const params = new HttpParams()
      .set('from', from.toISOString())
      .set('to', to.toISOString());

    this.isLoading.set(true);
    this.http.get<Game[]>(this.baseUrl, { params }).subscribe({
      next: (games) => {
        this.games.set(games);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  goToPreviousWeek(): void {
    const prev = new Date(this.selectedWeek());
    prev.setDate(prev.getDate() - 7);
    this.selectedWeek.set(prev);
  }

  goToNextWeek(): void {
    const next = new Date(this.selectedWeek());
    next.setDate(next.getDate() + 7);
    this.selectedWeek.set(next);
  }

  goToCurrentWeek(): void {
    this.selectedWeek.set(startOfWeek(new Date()));
  }

  createGame(data: CreateGameRequest): Observable<Game> {
    return this.http.post<Game>(this.baseUrl, data).pipe(
      tap((game) => {
        this.games.update((list) => [...list, game]);
      })
    );
  }

  updateGame(id: string, data: UpdateGameRequest): Observable<Game> {
    return this.http.patch<Game>(`${this.baseUrl}/${id}`, data).pipe(
      tap((updated) => {
        this.games.update((list) =>
          list.map((g) => (g.id === id ? updated : g))
        );
      })
    );
  }

  deleteGame(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.games.update((list) => list.filter((g) => g.id !== id));
      })
    );
  }
}
