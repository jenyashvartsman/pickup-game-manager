import { Component, OnInit, computed, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { UpcomingGamesCardComponent } from '../../components/upcoming-games-card/upcoming-games-card.component';
import { RecentResultsCardComponent } from '../../components/recent-results-card/recent-results-card.component';
import { TopPlayersCardComponent } from '../../components/top-players-card/top-players-card.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    UpcomingGamesCardComponent,
    RecentResultsCardComponent,
    TopPlayersCardComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  protected readonly isLoading = this.dashboardService.isLoading;
  protected readonly upcomingGames = computed(
    () => this.dashboardService.summary().upcomingGames
  );
  protected readonly recentResults = computed(
    () => this.dashboardService.summary().recentResults
  );
  protected readonly topPlayers = computed(
    () => this.dashboardService.summary().topPlayers
  );

  ngOnInit(): void {
    this.dashboardService.loadSummary();
  }
}
