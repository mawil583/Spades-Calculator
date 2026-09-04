import { describe, it, expect } from 'vitest';
import { inputRecipe } from '../customTheme';

describe('input theme', () => {
  it('keeps inputs at 16px to prevent iOS Safari focus zoom', () => {
    // iOS Safari zooms the page whenever an input with a computed font-size
    // below 16px receives focus, and the zoom sticks after the keyboard
    // closes. Only reproducible on real devices, so guard the recipe here.
    expect(inputRecipe.base?.fontSize).toBe('16px');
  });
});
