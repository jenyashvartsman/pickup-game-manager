import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  DashboardSummary,
  UpcomingGameDto,
  RecentResultDto,
  TopPlayerDto,
} from '../models/dashboard.model';

export type { UpcomingGameDto, RecentResultDto, TopPlayerDto, DashboardSummary };

const EMPTY_SUMMARY: DashboardSummary = {
  upcomingGames: [],
  recentResults: [],
  topPlayers: [],
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  readonly summary = signal<DashboardSummary>(EMPTY_SUMMARY);
  readonly isLoading = signal<boolean>(false);

  loadSummary(): void {
    this.isLoading.set(true);
    this.http.get<DashboardSummary>(this.baseUrl).subscribe({
      next: (data) => {
        this.summary.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
