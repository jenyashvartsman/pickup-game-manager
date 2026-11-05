import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-player-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './player-form-page.component.html',
  styleUrl: './player-form-page.component.scss',
})
export class PlayerFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playersService = inject(PlayersService);
  private readonly fb = inject(FormBuilder);

  protected readonly playerId = signal<string | null>(null);
  protected readonly isEditMode = computed(() => this.playerId() !== null);
  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    position: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.playerId.set(id);
    if (id) {
      this.playersService.getPlayer(id).subscribe((player) => {
        this.form.patchValue({ name: player.name, position: player.position });
      });
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const { name, position } = this.form.getRawValue();
    this.isSubmitting.set(true);
    const id = this.playerId();

    const request$ = id
      ? this.playersService.updatePlayer(id, { name, position })
      : this.playersService.createPlayer({ name, position });

    request$.subscribe({
      next: () => this.router.navigate(['/players']),
      error: () => this.isSubmitting.set(false),
    });
  }

  protected onCancel(): void {
    this.router.navigate(['/players']);
  }
}
