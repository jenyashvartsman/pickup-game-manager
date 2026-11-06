import { Component, OnChanges, inject, input, output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GamePlayer,
  GameStatus,
  PlayerStat,
  UpsertPlayerStatRequest,
} from '../../models/game.model';

@Component({
  selector: 'app-player-stats-form',
  imports: [ReactiveFormsModule],
  templateUrl: './player-stats-form.component.html',
  styleUrl: './player-stats-form.component.scss',
})
export class PlayerStatsFormComponent implements OnChanges {
  players = input.required<GamePlayer[]>();
  stats = input.required<PlayerStat[]>();
  gameStatus = input.required<GameStatus>();

  statsSubmitted = output<UpsertPlayerStatRequest[]>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    rows: this.fb.array<ReturnType<PlayerStatsFormComponent['buildRow']>>([]),
  });

  get rows(): FormArray {
    return this.form.controls.rows;
  }

  ngOnChanges(): void {
    this.rebuildRows();
  }

  private buildRow(player: GamePlayer, stat: PlayerStat | undefined) {
    return this.fb.nonNullable.group({
      playerId: [player.id],
      playerName: [player.name],
      goals: [stat?.goals ?? 0, [Validators.required, Validators.min(0)]],
      assists: [stat?.assists ?? 0, [Validators.required, Validators.min(0)]],
      yellowCards: [stat?.yellowCards ?? 0, [Validators.required, Validators.min(0)]],
      redCards: [stat?.redCards ?? 0, [Validators.required, Validators.min(0)]],
      minutesPlayed: [stat?.minutesPlayed ?? 90, [Validators.required, Validators.min(0)]],
    });
  }

  private rebuildRows(): void {
    this.rows.clear();
    for (const player of this.players()) {
      const existing = this.stats().find((s) => s.playerId === player.id);
      this.rows.push(this.buildRow(player, existing));
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const payload: UpsertPlayerStatRequest[] = this.rows.controls.map((row) => {
      const { playerId, goals, assists, yellowCards, redCards, minutesPlayed } =
        (row as ReturnType<PlayerStatsFormComponent['buildRow']>).getRawValue();
      return { playerId, goals, assists, yellowCards, redCards, minutesPlayed };
    });
    this.statsSubmitted.emit(payload);
  }
}
