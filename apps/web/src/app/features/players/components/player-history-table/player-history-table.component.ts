import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerStat } from '../../models/player.model';

@Component({
  selector: 'app-player-history-table',
  imports: [RouterLink],
  templateUrl: './player-history-table.component.html',
  styleUrl: './player-history-table.component.scss',
})
export class PlayerHistoryTableComponent {
  stats = input.required<PlayerStat[]>();

  protected formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
