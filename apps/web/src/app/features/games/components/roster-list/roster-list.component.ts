import { Component, computed, input, output, signal } from '@angular/core';
import { GamePlayer, GameStatus } from '../../models/game.model';

@Component({
  selector: 'app-roster-list',
  templateUrl: './roster-list.component.html',
  styleUrl: './roster-list.component.scss',
})
export class RosterListComponent {
  players = input.required<GamePlayer[]>();
  availablePlayers = input.required<GamePlayer[]>();
  gameStatus = input.required<GameStatus>();

  playerAdded = output<string>();
  playerRemoved = output<string>();

  protected readonly selectedPlayerId = signal<string>('');

  protected readonly isEditable = computed(
    () => this.gameStatus() !== 'cancelled'
  );

  protected readonly unrosteredPlayers = computed(() => {
    const rosteredIds = new Set(this.players().map((p) => p.id));
    return this.availablePlayers().filter((p) => !rosteredIds.has(p.id));
  });

  protected onAddPlayer(): void {
    const id = this.selectedPlayerId();
    if (!id) return;
    this.playerAdded.emit(id);
    this.selectedPlayerId.set('');
  }

  protected onRemovePlayer(playerId: string): void {
    this.playerRemoved.emit(playerId);
  }
}
