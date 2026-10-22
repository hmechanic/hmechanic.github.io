import { describe, expect, it } from 'vitest';
import { cvByLang } from './cv';
import { LANGUAGES } from '@/i18n/types';
import type { ExperienceGroup, SkillCategory } from '@/types/cv';

// The CV YAML is hand-edited and parsed at build time; these checks catch
// structural slips (a renamed key, a section dropped in one language) that the
// components would otherwise render as empty space.
describe.each(LANGUAGES)('CV (%s)', (lang) => {
  const cv = cvByLang[lang];

  it('has the heading and profile the hero and about sections read', () => {
    expect(cv.heading.name).toMatch(/\S+ \S+/);
    expect(cv.professional_profile.title).toBeTruthy();
    expect(cv.professional_profile.content).toBeTruthy();
  });

  it('has an email and social links', () => {
    const email = cv.subheading.find((s) => s.type === 'links')?.content[0]?.name;
    const socials = cv.subheading.find((s) => s.type === 'socials')?.content ?? [];
    expect(email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(socials.map((s) => s.type)).toEqual(expect.arrayContaining(['github', 'linkedin']));
    for (const social of socials) expect(social.url).toMatch(/^https:\/\//);
  });

  it('has experience entries with position, organization and dates', () => {
    const groups = cv.sections
      .filter((s) => s.type === 'experience')
      .flatMap((s) => s.content ?? []) as ExperienceGroup[];
    const jobs = groups.flatMap((g) => g.entity);
    expect(jobs.length).toBeGreaterThan(0);
    for (const job of jobs) {
      expect(job.position).toBeTruthy();
      expect(job.organization).toBeTruthy();
      expect(job.dates).toBeTruthy();
    }
  });

  it('has skill categories with data', () => {
    const skills = (cv.sections.find((s) => s.type === 'skills')?.content?.[0]?.entity ??
      []) as SkillCategory[];
    expect(skills.length).toBeGreaterThan(0);
    for (const category of skills) expect(category.data.trim()).not.toBe('');
  });
});

describe('CV translations', () => {
  it('keep the same sections and entry counts in every language', () => {
    const shape = (lang: (typeof LANGUAGES)[number]) =>
      cvByLang[lang].sections.map((s) => [s.type, s.content?.map((g) => g.entity.length)]);
    expect(shape('en')).toEqual(shape('es'));
  });
});
