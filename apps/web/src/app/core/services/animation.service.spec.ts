import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animation.service';

jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    fromTo: jest.fn(),
    to: jest.fn(),
  },
}));

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockReturnValue({ matches }),
  });
};

describe('AnimationService', () => {
  let service: AnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimationService);
    jest.clearAllMocks();
  });

  describe('prefersReducedMotion', () => {
    it('returns true when media query matches', () => {
      mockMatchMedia(true);
      expect(service.prefersReducedMotion()).toBe(true);
    });

    it('returns false when media query does not match', () => {
      mockMatchMedia(false);
      expect(service.prefersReducedMotion()).toBe(false);
    });

    it('returns false when matchMedia is unavailable', () => {
      const original = window.matchMedia;
      Object.defineProperty(window, 'matchMedia', { writable: true, value: undefined });
      expect(service.prefersReducedMotion()).toBe(false);
      Object.defineProperty(window, 'matchMedia', { writable: true, value: original });
    });
  });

  describe('staggerIn', () => {
    it('does nothing when prefersReducedMotion is true', () => {
      mockMatchMedia(true);
      const gsapMock = jest.requireMock('gsap').default;
      service.staggerIn([document.createElement('div')]);
      expect(gsapMock.fromTo).not.toHaveBeenCalled();
    });

    it('does nothing when elements array is empty', () => {
      mockMatchMedia(false);
      const gsapMock = jest.requireMock('gsap').default;
      service.staggerIn([]);
      expect(gsapMock.fromTo).not.toHaveBeenCalled();
    });

    it('calls gsap.fromTo with stagger when motion is allowed', () => {
      mockMatchMedia(false);
      const gsapMock = jest.requireMock('gsap').default;
      const el = document.createElement('div');
      service.staggerIn([el]);
      expect(gsapMock.fromTo).toHaveBeenCalledWith(
        [el],
        expect.objectContaining({ opacity: 0, y: 24 }),
        expect.objectContaining({ opacity: 1, y: 0, stagger: expect.any(Number) })
      );
    });
  });

  describe('slideWeek', () => {
    it('does nothing when prefersReducedMotion is true', () => {
      mockMatchMedia(true);
      const gsapMock = jest.requireMock('gsap').default;
      service.slideWeek(document.createElement('div'), 'left');
      expect(gsapMock.fromTo).not.toHaveBeenCalled();
    });

    it('slides from right (x: 100%) for direction "left"', () => {
      mockMatchMedia(false);
      const gsapMock = jest.requireMock('gsap').default;
      const el = document.createElement('div');
      service.slideWeek(el, 'left');
      expect(gsapMock.fromTo).toHaveBeenCalledWith(
        el,
        expect.objectContaining({ x: '100%' }),
        expect.any(Object)
      );
    });

    it('slides from left (x: -100%) for direction "right"', () => {
      mockMatchMedia(false);
      const gsapMock = jest.requireMock('gsap').default;
      const el = document.createElement('div');
      service.slideWeek(el, 'right');
      expect(gsapMock.fromTo).toHaveBeenCalledWith(
        el,
        expect.objectContaining({ x: '-100%' }),
        expect.any(Object)
      );
    });
  });
});
