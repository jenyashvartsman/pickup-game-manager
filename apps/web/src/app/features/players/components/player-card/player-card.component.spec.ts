import { TestBed } from '@angular/core/testing';
import { PlayerCardComponent } from './player-card.component';
import { Player } from '../../models/player.model';

const mockPlayer: Player = {
  id: '1',
  name: 'Alice Smith',
  position: 'Forward',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('PlayerCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', mockPlayer);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render player name', () => {
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.player-card__name');
    expect(name.textContent.trim()).toBe('Alice Smith');
  });

  it('should render player position', () => {
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
    const position = fixture.nativeElement.querySelector(
      '.player-card__position'
    );
    expect(position.textContent.trim()).toBe('Forward');
  });

  it('should derive initials from two-word name', () => {
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
    const initials = fixture.nativeElement.querySelector(
      '.player-card__initials'
    );
    expect(initials.textContent.trim()).toBe('AS');
  });

  it('should derive initials from single-word name', () => {
    const singleName: Player = { ...mockPlayer, name: 'Pelé' };
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', singleName);
    fixture.detectChanges();
    const initials = fixture.nativeElement.querySelector(
      '.player-card__initials'
    );
    expect(initials.textContent.trim()).toBe('PE');
  });

  it('should emit editRequested with player when edit button clicked', () => {
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
    let emitted: Player | undefined;
    fixture.componentInstance.editRequested.subscribe((p) => (emitted = p));
    const btn = fixture.nativeElement.querySelector(
      '.player-card__btn--edit'
    ) as HTMLButtonElement;
    btn.click();
    expect(emitted).toEqual(mockPlayer);
  });

  it('should emit deleteRequested with player when delete button clicked', () => {
    const fixture = TestBed.createComponent(PlayerCardComponent);
    fixture.componentRef.setInput('player', mockPlayer);
    fixture.detectChanges();
    let emitted: Player | undefined;
    fixture.componentInstance.deleteRequested.subscribe((p) => (emitted = p));
    const btn = fixture.nativeElement.querySelector(
      '.player-card__btn--delete'
    ) as HTMLButtonElement;
    btn.click();
    expect(emitted).toEqual(mockPlayer);
  });
});
