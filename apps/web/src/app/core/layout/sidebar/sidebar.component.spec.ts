import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

@Component({ template: '' })
class TestPage {}

const testRoutes = [
  { path: '', pathMatch: 'full' as const, component: TestPage },
  { path: 'dashboard', component: TestPage },
  { path: 'games', component: TestPage },
  { path: 'players', component: TestPage },
];

describe('SidebarComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.className = '';
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter(testRoutes)],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render three nav links', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('.sidebar__nav-link');
    expect(links.length).toBe(3);
  });

  it('should render theme toggle button', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.sidebar__theme-toggle');
    expect(btn).toBeTruthy();
  });

  it('should add sidebar--open class when isOpen input is true', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    const aside = fixture.nativeElement.querySelector('.sidebar');
    expect(aside.classList.contains('sidebar--open')).toBe(true);
  });

  it('should not have sidebar--open class by default', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const aside = fixture.nativeElement.querySelector('.sidebar');
    expect(aside.classList.contains('sidebar--open')).toBe(false);
  });

  it('should emit closeRequested when a nav link is clicked', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.closeRequested.subscribe(() => {
      emitted = true;
    });
    const link = fixture.nativeElement.querySelector(
      '.sidebar__nav-link'
    ) as HTMLElement;
    link.click();
    expect(emitted).toBe(true);
  });

  it('should toggle theme on button click', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector(
      '.sidebar__theme-toggle'
    ) as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(
      fixture.componentInstance['themeService'].theme()
    ).toBe('theme-light');
  });
});
