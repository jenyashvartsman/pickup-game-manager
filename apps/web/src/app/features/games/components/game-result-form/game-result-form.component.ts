import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CreateGameResultRequest,
  GameResult,
  GameStatus,
} from '../../models/game.model';

@Component({
  selector: 'app-game-result-form',
  imports: [ReactiveFormsModule],
  templateUrl: './game-result-form.component.html',
  styleUrl: './game-result-form.component.scss',
})
export class GameResultFormComponent {
  result = input<GameResult | null>(null);
  gameStatus = input.required<GameStatus>();

  resultSubmitted = output<CreateGameResultRequest>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    scoreTeamA: [0, [Validators.required, Validators.min(0)]],
    scoreTeamB: [0, [Validators.required, Validators.min(0)]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) return;
    this.resultSubmitted.emit(this.form.getRawValue());
  }
}
