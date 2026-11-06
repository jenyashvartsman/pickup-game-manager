import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.scss',
})
export class SkeletonCardComponent {
  count = input<number>(3);

  protected readonly items = computed(() =>
    Array.from({ length: this.count() }, (_, i) => i)
  );
}
