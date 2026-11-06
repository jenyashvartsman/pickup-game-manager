import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopPlayerDto } from '../../services/dashboard.service';

@Component({
  selector: 'app-top-players-card',
  imports: [RouterLink],
  templateUrl: './top-players-card.component.html',
  styleUrl: './top-players-card.component.scss',
})
export class TopPlayersCardComponent {
  readonly players = input.required<TopPlayerDto[]>();
}
