import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to theme-dark', () => {
    expect(service.theme()).toBe('theme-dark');
  });

  it('should apply theme-dark class to <html> on init', () => {
    expect(document.documentElement.classList.contains('theme-dark')).toBe(
      true
    );
  });

  it('should toggle to theme-light', () => {
    service.toggle();
    expect(service.theme()).toBe('theme-light');
  });

  it('should apply theme-light class after toggle', () => {
    service.toggle();
    expect(document.documentElement.classList.contains('theme-light')).toBe(
      true
    );
    expect(document.documentElement.classList.contains('theme-dark')).toBe(
      false
    );
  });

  it('should toggle back to theme-dark', () => {
    service.toggle();
    service.toggle();
    expect(service.theme()).toBe('theme-dark');
  });

  it('should persist theme to localStorage', () => {
    service.toggle();
    expect(localStorage.getItem('pickup-theme')).toBe('theme-light');
  });

  it('should restore persisted theme on creation', () => {
    localStorage.setItem('pickup-theme', 'theme-light');
    TestBed.resetTestingModule();
    document.documentElement.className = '';
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(ThemeService);
    expect(freshService.theme()).toBe('theme-light');
  });
});
