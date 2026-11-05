import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PlayersListPageComponent } from './players-list-page.component';
import { Player } from '../../models/player.model';

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Alice Smith',
    position: 'Forward',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Bob Jones',
    position: 'Defender',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

describe('PlayersListPageComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersListPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    const fixture = TestBed.createComponent(PlayersListPageComponent);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/api/players').flush([]);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render player cards after load', () => {
    const fixture = TestBed.createComponent(PlayersListPageComponent);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/api/players').flush(mockPlayers);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('app-player-card');
    expect(cards.length).toBe(2);
  });

  it('should filter players by search query', () => {
    const fixture = TestBed.createComponent(PlayersListPageComponent);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/api/players').flush(mockPlayers);
    fixture.detectChanges();

    fixture.componentInstance['searchQuery'].set('alice');
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-player-card');
    expect(cards.length).toBe(1);
  });

  it('should show empty state when no matches', () => {
    const fixture = TestBed.createComponent(PlayersListPageComponent);
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/api/players').flush(mockPlayers);
    fixture.detectChanges();

    fixture.componentInstance['searchQuery'].set('zzz');
    fixture.detectChanges();

    const state = fixture.nativeElement.querySelector(
      '.players-list-page__state'
    );
    expect(state.textContent.trim()).toBe('No players found.');
  });
});
