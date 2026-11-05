import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlayersService } from '../../services/players.service';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-players-list-page',
  imports: [RouterLink, PlayerCardComponent],
  templateUrl: './players-list-page.component.html',
  styleUrl: './players-list-page.component.scss',
})
export class PlayersListPageComponent implements OnInit {
  private readonly router = inject(Router);
  protected readonly playersService = inject(PlayersService);

  protected readonly searchQuery = signal('');

  protected readonly filteredPlayers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.playersService.players();
    return this.playersService.players().filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.position.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.playersService.loadPlayers();
  }

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected onEdit(player: Player): void {
    this.router.navigate(['/players', player.id, 'edit']);
  }

  protected onDelete(player: Player): void {
    if (!confirm(`Delete ${player.name}?`)) return;
    this.playersService.deletePlayer(player.id).subscribe();
  }
}
