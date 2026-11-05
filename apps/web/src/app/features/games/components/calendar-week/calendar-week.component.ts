import { Component, computed, input, output } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameCardComponent } from '../game-card/game-card.component';

export interface CalendarDay {
  date: Date;
  label: string;
  isToday: boolean;
  games: Game[];
}

@Component({
  selector: 'app-calendar-week',
  imports: [GameCardComponent],
  templateUrl: './calendar-week.component.html',
  styleUrl: './calendar-week.component.scss',
})
export class CalendarWeekComponent {
  weekStart = input.required<Date>();
  games = input<Game[]>([]);
  daySlotClicked = output<Date>();
  gameSelected = output<Game>();

  protected readonly days = computed<CalendarDay[]>(() => {
    const start = this.weekStart();
    const allGames = this.games();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayGames = allGames.filter((g) => {
        const t = new Date(g.scheduledAt).getTime();
        return t >= dayStart.getTime() && t <= dayEnd.getTime();
      });

      return {
        date,
        label: date.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        isToday: date.getTime() === today.getTime(),
        games: dayGames,
      };
    });
  });
}
