import { Component, computed, input, output } from '@angular/core';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
})
export class PlayerCardComponent {
  player = input.required<Player>();
  editRequested = output<Player>();
  deleteRequested = output<Player>();

  protected initials = computed(() => {
    const parts = this.player().name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  });
}
