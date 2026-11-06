import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the default message', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No data available.');
  });

  it('renders a custom message', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'No players found.');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.empty-state__message')?.textContent?.trim()
    ).toBe('No players found.');
  });
});
