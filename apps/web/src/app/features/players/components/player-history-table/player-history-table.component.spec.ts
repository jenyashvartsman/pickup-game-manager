import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerHistoryTableComponent } from './player-history-table.component';
import { PlayerStat } from '../../models/player.model';

const makeStat = (overrides: Partial<PlayerStat> = {}): PlayerStat => ({
  id: 'stat-1',
  gameId: 'game-1',
  playerId: 'player-1',
  gameScheduledAt: '2026-11-08T18:00:00Z',
  goals: 1,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  minutesPlayed: 90,
  createdAt: '2026-11-08T20:00:00Z',
  updatedAt: '2026-11-08T20:00:00Z',
  ...overrides,
});

describe('PlayerHistoryTableComponent', () => {
  let fixture: ComponentFixture<PlayerHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHistoryTableComponent, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(PlayerHistoryTableComponent);
  });

  it('shows empty state when stats array is empty', () => {
    fixture.componentRef.setInput('stats', []);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.player-history-table__empty')).toBeTruthy();
    expect(el.querySelector('.player-history-table__table')).toBeNull();
  });

  it('renders a row per stat', () => {
    const stats = [makeStat({ id: 'stat-1' }), makeStat({ id: 'stat-2' })];
    fixture.componentRef.setInput('stats', stats);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.player-history-table__row');
    expect(rows.length).toBe(2);
  });

  it('displays goals, assists and minutes in each row', () => {
    fixture.componentRef.setInput('stats', [makeStat({ goals: 2, assists: 1, minutesPlayed: 85 })]);
    fixture.detectChanges();
    const tds = fixture.nativeElement.querySelectorAll('.player-history-table__td');
    // date | goals | assists | yc | rc | min
    expect(tds[1].textContent.trim()).toBe('2');
    expect(tds[2].textContent.trim()).toBe('1');
    expect(tds[5].textContent.trim()).toBe('85');
  });

  it('links each row to the game detail page', () => {
    fixture.componentRef.setInput('stats', [makeStat({ gameId: 'game-abc' })]);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.player-history-table__game-link');
    expect(link.getAttribute('href')).toBe('/games/game-abc');
  });
});
