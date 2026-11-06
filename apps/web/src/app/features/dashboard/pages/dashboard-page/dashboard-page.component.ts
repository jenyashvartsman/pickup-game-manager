import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { UpcomingGamesCardComponent } from '../../components/upcoming-games-card/upcoming-games-card.component';
import { RecentResultsCardComponent } from '../../components/recent-results-card/recent-results-card.component';
import { TopPlayersCardComponent } from '../../components/top-players-card/top-players-card.component';
import { AnimationService } from '../../../../core/services/animation.service';

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
  private readonly elementRef = inject(ElementRef);
  private readonly animationService = inject(AnimationService);
  private readonly injector = inject(Injector);
  private animationPlayed = false;

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

  constructor() {
    effect(() => {
      const loading = this.isLoading();
      if (!loading && !this.animationPlayed) {
        this.animationPlayed = true;
        // Defer until after Angular has committed the DOM for this CD cycle
        Promise.resolve().then(() => {
          const sections: Element[] = Array.from(
            this.elementRef.nativeElement.querySelectorAll(
              '.dashboard-page__section'
            )
          );
          this.animationService.staggerIn(sections);
        });
      }
    });
  }

  ngOnInit(): void {
    this.dashboardService.loadSummary();
  }
}
