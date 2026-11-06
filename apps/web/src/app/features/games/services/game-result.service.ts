import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  GameResult,
  CreateGameResultRequest,
  UpdateGameResultRequest,
} from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameResultService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/games`;

  readonly result = signal<GameResult | null>(null);
  readonly isLoading = signal<boolean>(false);

  loadResult(gameId: string): void {
    this.isLoading.set(true);
    this.http.get<GameResult>(`${this.baseUrl}/${gameId}/result`).subscribe({
      next: (result) => {
        this.result.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.result.set(null);
        this.isLoading.set(false);
      },
    });
  }

  createResult(
    gameId: string,
    data: CreateGameResultRequest
  ): Observable<GameResult> {
    return this.http
      .post<GameResult>(`${this.baseUrl}/${gameId}/result`, data)
      .pipe(tap((result) => this.result.set(result)));
  }

  updateResult(
    gameId: string,
    data: UpdateGameResultRequest
  ): Observable<GameResult> {
    return this.http
      .patch<GameResult>(`${this.baseUrl}/${gameId}/result`, data)
      .pipe(tap((result) => this.result.set(result)));
  }
}
