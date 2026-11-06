import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { CalendarWeekComponent } from '../../components/calendar-week/calendar-week.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card.component';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-games-calendar-page',
  imports: [CalendarWeekComponent, EmptyStateComponent, SkeletonCardComponent],
  templateUrl: './games-calendar-page.component.html',
  styleUrl: './games-calendar-page.component.scss',
})
export class GamesCalendarPageComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly gamesService = inject(GamesService);
  protected readonly slideDirection = signal<'left' | 'right'>('left');

  ngOnInit(): void {
    this.gamesService.loadGamesForWeek();
  }

  protected onPreviousWeek(): void {
    this.slideDirection.set('right');
    this.gamesService.goToPreviousWeek();
    this.gamesService.loadGamesForWeek();
  }

  protected onNextWeek(): void {
    this.slideDirection.set('left');
    this.gamesService.goToNextWeek();
    this.gamesService.loadGamesForWeek();
  }

  protected onToday(): void {
    this.gamesService.goToCurrentWeek();
    this.gamesService.loadGamesForWeek();
  }

  protected onDaySlotClicked(date: Date): void {
    const isoDate = date.toISOString();
    this.router.navigate(['/games', 'new'], {
      queryParams: { date: isoDate },
    });
  }

  protected onGameSelected(game: Game): void {
    this.router.navigate(['/games', game.id]);
  }

  protected formatWeekRange(): string {
    const { from, to } = this.gamesService.weekRange();
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${from.toLocaleDateString([], opts)} – ${to.toLocaleDateString([], opts)}, ${to.getFullYear()}`;
  }
}
