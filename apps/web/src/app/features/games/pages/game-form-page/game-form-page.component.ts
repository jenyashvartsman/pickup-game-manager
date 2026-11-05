import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-game-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './game-form-page.component.html',
  styleUrl: './game-form-page.component.scss',
})
export class GameFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gamesService = inject(GamesService);
  private readonly fb = inject(FormBuilder);

  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    scheduledAt: ['', Validators.required],
    location: [''],
  });

  ngOnInit(): void {
    const dateParam = this.route.snapshot.queryParamMap.get('date');
    if (dateParam) {
      const local = new Date(dateParam);
      // Set a default time of 10:00 on the clicked date
      local.setHours(10, 0, 0, 0);
      this.form.patchValue({ scheduledAt: this.toDateTimeLocal(local) });
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) return;
    const { scheduledAt, location } = this.form.getRawValue();
    this.isSubmitting.set(true);

    const payload = {
      scheduledAt: new Date(scheduledAt).toISOString(),
      ...(location ? { location } : {}),
    };

    this.gamesService.createGame(payload).subscribe({
      next: () => this.router.navigate(['/games']),
      error: () => this.isSubmitting.set(false),
    });
  }

  protected onCancel(): void {
    this.router.navigate(['/games']);
  }

  private toDateTimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  }
}
