import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ErrorToastComponent } from '../../../shared/components/error-toast/error-toast.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, ErrorToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  protected readonly isSidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
