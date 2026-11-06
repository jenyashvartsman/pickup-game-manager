import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerStatsChartComponent } from './player-stats-chart.component';
import { PlayerStat } from '../../models/player.model';

// Chart.js uses canvas; provide a stub in jsdom
const mockChart = {
  destroy: jest.fn(),
};

jest.mock('chart.js', () => ({
  Chart: Object.assign(jest.fn().mockImplementation(() => mockChart), {
    register: jest.fn(),
  }),
  registerables: [],
}));

const makeStat = (overrides: Partial<PlayerStat> = {}): PlayerStat => ({
  id: 'stat-1',
  gameId: 'game-1',
  playerId: 'player-1',
  gameScheduledAt: '2026-11-08T18:00:00Z',
  goals: 2,
  assists: 1,
  yellowCards: 0,
  redCards: 0,
  minutesPlayed: 90,
  createdAt: '2026-11-08T20:00:00Z',
  updatedAt: '2026-11-08T20:00:00Z',
  ...overrides,
});

describe('PlayerStatsChartComponent', () => {
  let fixture: ComponentFixture<PlayerStatsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerStatsChartComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PlayerStatsChartComponent);
  });

  it('shows empty state when stats is empty', () => {
    fixture.componentRef.setInput('stats', []);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.player-stats-chart__empty')).toBeTruthy();
    expect(el.querySelector('.player-stats-chart__canvas')).toBeNull();
  });

  it('renders canvas when stats are provided', () => {
    fixture.componentRef.setInput('stats', [makeStat()]);
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('.player-stats-chart__canvas');
    expect(canvas).toBeTruthy();
  });
});
