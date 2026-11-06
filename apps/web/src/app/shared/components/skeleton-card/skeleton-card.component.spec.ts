import { TestBed } from '@angular/core/testing';
import { SkeletonCardComponent } from './skeleton-card.component';

describe('SkeletonCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SkeletonCardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders 3 skeleton items by default', () => {
    const fixture = TestBed.createComponent(SkeletonCardComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.skeleton-card__item');
    expect(items.length).toBe(3);
  });

  it('renders the specified number of skeleton items', () => {
    const fixture = TestBed.createComponent(SkeletonCardComponent);
    fixture.componentRef.setInput('count', 5);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.skeleton-card__item');
    expect(items.length).toBe(5);
  });

  it('renders with aria-busy attribute', () => {
    const fixture = TestBed.createComponent(SkeletonCardComponent);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.skeleton-card');
    expect(container.getAttribute('aria-busy')).toBe('true');
  });
});
