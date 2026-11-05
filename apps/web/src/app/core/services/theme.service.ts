import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'theme-dark' | 'theme-light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'pickup-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _theme = signal<Theme>(this.getInitialTheme());

  readonly theme = this._theme.asReadonly();

  constructor() {
    this.applyTheme(this._theme());
  }

  toggle(): void {
    const next: Theme =
      this._theme() === 'theme-dark' ? 'theme-light' : 'theme-dark';
    this._theme.set(next);
    this.applyTheme(next);
  }

  private getInitialTheme(): Theme {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      return stored === 'theme-light' ? 'theme-light' : 'theme-dark';
    }
    return 'theme-dark';
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    html.classList.remove('theme-dark', 'theme-light');
    html.classList.add(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
