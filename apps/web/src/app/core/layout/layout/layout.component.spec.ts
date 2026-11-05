import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.className = '';
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render app-sidebar', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should render router-outlet inside main', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main router-outlet')).toBeTruthy();
  });

  it('should start with sidebar closed', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    expect(fixture.componentInstance['isSidebarOpen']()).toBe(false);
  });

  it('should open sidebar on toggleSidebar', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.componentInstance['toggleSidebar']();
    expect(fixture.componentInstance['isSidebarOpen']()).toBe(true);
  });

  it('should close sidebar on closeSidebar', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.componentInstance['toggleSidebar']();
    fixture.componentInstance['closeSidebar']();
    expect(fixture.componentInstance['isSidebarOpen']()).toBe(false);
  });
});
