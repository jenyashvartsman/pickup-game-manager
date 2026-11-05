import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  closeRequested = output<void>();

  protected readonly themeService = inject(ThemeService);

  protected onNavLinkClick(): void {
    this.closeRequested.emit();
  }
}
