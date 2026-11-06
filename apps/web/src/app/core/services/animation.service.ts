import { Injectable } from '@angular/core';
import gsap from 'gsap';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Stagger-fade-up a list of elements into view.
   * Duration ≤ 400 ms total (35 ms per element + 80 ms stagger).
   */
  staggerIn(elements: Element[]): void {
    if (this.prefersReducedMotion() || !elements.length) return;
    gsap.fromTo(
      elements,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }
    );
  }

  /**
   * Slide a container in from the specified direction.
   * direction 'left'  → new week enters from the right  (x: 100% → 0)
   * direction 'right' → new week enters from the left   (x: -100% → 0)
   */
  slideWeek(container: Element, direction: 'left' | 'right'): void {
    if (this.prefersReducedMotion()) return;
    const xFrom = direction === 'left' ? '100%' : '-100%';
    gsap.fromTo(
      container,
      { x: xFrom, opacity: 0 },
      { x: '0%', opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
  }
}
