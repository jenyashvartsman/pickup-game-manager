import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UpcomingGameDto } from '../../services/dashboard.service';

@Component({
  selector: 'app-upcoming-games-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './upcoming-games-card.component.html',
  styleUrl: './upcoming-games-card.component.scss',
})
export class UpcomingGamesCardComponent {
  readonly games = input.required<UpcomingGameDto[]>();
}
