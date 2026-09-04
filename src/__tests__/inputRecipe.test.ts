import { describe, it, expect } from 'vitest';
import { inputRecipe, system } from '../customTheme';

describe('input theme', () => {
  it('keeps inputs at 16px base font size to prevent iOS Safari focus zoom', () => {
    // iOS Safari zooms the page whenever an input with a computed font-size
    // below 16px receives focus, and the zoom sticks after the keyboard
    // closes. Only reproducible on real devices, so guard the recipe here.
    expect(inputRecipe.base?.fontSize).toBe('16px');
  });

  it('ensures default md input size variant uses textStyle md (16px)', () => {
    // Chakra UI's default input recipe assigns size "md" to textStyle "sm".
    // We override "md" to textStyle "md" (16px) so standard inputs never zoom on iOS.
    const sizes = inputRecipe.variants?.size as
      | Record<string, { textStyle?: string; fontSize?: string }>
      | undefined;
    expect(sizes?.md?.textStyle).toBe('md');
    expect(system.token('fontSizes.md')).toBe('16px');
  });

  it('ensures lg input size variant uses textStyle lg (18px)', () => {
    const sizes = inputRecipe.variants?.size as
      | Record<string, { textStyle?: string; fontSize?: string }>
      | undefined;
    expect(sizes?.lg?.textStyle).toBe('lg');
    expect(system.token('fontSizes.lg')).toBe('18px');
  });

  it('defaults to md size variant', () => {
    expect(inputRecipe.defaultVariants?.size).toBe('md');
  });
});
