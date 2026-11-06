import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RecentResultDto } from '../../services/dashboard.service';

@Component({
  selector: 'app-recent-results-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './recent-results-card.component.html',
  styleUrl: './recent-results-card.component.scss',
})
export class RecentResultsCardComponent {
  readonly results = input.required<RecentResultDto[]>();
}
