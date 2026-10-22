import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';
import { translations } from '.';

// Lists every leaf path of a translation object (JSX fragments count as leaves),
// e.g. `hero.greeting` or `nav.items.0.label`.
const leafPaths = (value: unknown, prefix = ''): string[] => {
  if (value === null || typeof value !== 'object' || isValidElement(value)) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
};

describe('translations', () => {
  it('define exactly the same keys in Spanish and English', () => {
    expect(leafPaths(translations.en).sort()).toEqual(leafPaths(translations.es).sort());
  });

  it('use the same section ids, in the same order, for navigation', () => {
    const ids = (lang: 'es' | 'en') => ({
      nav: translations[lang].nav.items.map((i) => i.id),
      progress: translations[lang].progress.items.map((i) => i.id),
    });
    expect(ids('en')).toEqual(ids('es'));
  });

  it('have no empty strings', () => {
    for (const lang of ['es', 'en'] as const) {
      const empty = leafPaths(translations[lang]).filter((path) => {
        const value = path
          .split('.')
          .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], translations[lang]);
        return typeof value === 'string' && value.trim() === '';
      });
      expect(empty, lang).toEqual([]);
    }
  });
});
