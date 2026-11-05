import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { PlayerFormPageComponent } from './player-form-page.component';
import { Player } from '../../models/player.model';

const mockPlayer: Player = {
  id: '1',
  name: 'Alice Smith',
  position: 'Forward',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('PlayerFormPageComponent', () => {
  let httpMock: HttpTestingController;

  function setup(paramId: string | null = null) {
    TestBed.configureTestingModule({
      imports: [PlayerFormPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => paramId } },
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    return TestBed.createComponent(PlayerFormPageComponent);
  }

  afterEach(() => httpMock.verify());

  it('should create in add mode', () => {
    const fixture = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show "Add Player" title in add mode', () => {
    const fixture = setup();
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.player-form-page__title');
    expect(title.textContent.trim()).toBe('Add Player');
  });

  it('should show "Edit Player" title in edit mode', () => {
    const fixture = setup('1');
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/api/players/1').flush(mockPlayer);
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.player-form-page__title');
    expect(title.textContent.trim()).toBe('Edit Player');
  });

  it('should pre-fill form in edit mode', () => {
    const fixture = setup('1');
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/api/players/1').flush(mockPlayer);
    fixture.detectChanges();
    expect(fixture.componentInstance['form'].getRawValue()).toEqual({
      name: 'Alice Smith',
      position: 'Forward',
    });
  });

  it('should mark form invalid when name is empty', () => {
    const fixture = setup();
    fixture.detectChanges();
    const { form } = fixture.componentInstance as unknown as { form: FormGroup };
    form.controls.name.setValue('');
    expect(form.controls.name.invalid).toBe(true);
  });

  it('should mark form invalid when name is too short', () => {
    const fixture = setup();
    fixture.detectChanges();
    const { form } = fixture.componentInstance as unknown as { form: FormGroup };
    form.controls.name.setValue('A');
    expect(form.controls.name.invalid).toBe(true);
  });
});
