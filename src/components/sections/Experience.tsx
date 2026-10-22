import { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useCardReveal, useReveal } from '@/hooks/useReveal';
import type { ExperienceGroup, Job } from '@/types/cv';

// Achievements shown before "show more": enough to read the role at a glance
// without a phone-length wall of text per job.
const VISIBLE_ACHIEVEMENTS = 2;

const isCurrent = (dates: string) => /present/i.test(dates);

/** One role on the timeline. On phones it drops the card chrome so the text
 *  gets nearly the full width; from sm up it sits in a bordered card. */
const Role = ({ job }: { job: Job }) => {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const articleRef = useRef<HTMLElement>(null);
  const items = job.responsibilities ?? [];
  const hidden = items.length - VISIBLE_ACHIEVEMENTS;
  const shown = expanded || hidden <= 0 ? items : items.slice(0, VISIBLE_ACHIEVEMENTS);
  const current = isCurrent(job.dates);

  const toggle = () => {
    // Collapsing a long list can leave the reader far below the role: bring its
    // header back into view.
    if (expanded) articleRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    setExpanded(!expanded);
  };

  return (
    <article
      ref={articleRef}
      className="scroll-mt-24 sm:rounded-xl sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-6 sm:transition-colors sm:hover:border-neon-cyan/40"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-wider text-gray-400 sm:text-xs">
        <span>{job.dates}</span>
        {current && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-2 py-0.5 text-[0.65rem] text-neon-green">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-neon-green" />
            {t.experience.current}
          </span>
        )}
      </div>
      <h4 className="mt-1.5 text-lg font-semibold leading-snug text-white sm:text-xl">
        {job.position}
      </h4>
      <p className="mt-0.5 text-sm font-medium text-neon-purple">{job.organization}</p>

      {items.length > 0 && (
        <ul
          id={listId}
          className="mt-3 space-y-2.5 text-sm leading-6 text-gray-300 sm:mt-4 sm:text-[0.95rem] sm:leading-7"
        >
          {shown.map((item) => (
            <li key={item} className="relative pl-4">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.6rem] h-1 w-1 rounded-full bg-neon-cyan sm:top-[0.7rem]"
              />
              {item}
            </li>
          ))}
        </ul>
      )}

      {hidden > 0 && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md py-1 font-mono text-xs uppercase tracking-wider text-neon-cyan transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
        >
          {expanded ? t.experience.showLess : t.experience.showMore.replace('{count}', String(hidden))}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </article>
  );
};

/** Certificates have no achievements: a compact grid where the course is the
 *  title and the whole tile links to the credential. */
const Certificate = ({ job }: { job: Job }) => {
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="text-[0.95rem] font-semibold leading-snug text-white transition-colors group-hover:text-neon-cyan">
          {job.organization}
        </span>
        {job.certificate && (
          <ExternalLink
            size={15}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-gray-500 transition-colors group-hover:text-neon-cyan"
          />
        )}
      </span>
      <span className="mt-2 block text-sm text-neon-purple">{job.position}</span>
      <span className="mt-0.5 block font-mono text-[0.7rem] uppercase tracking-wider text-gray-500">
        {job.dates}
      </span>
    </>
  );
  const className =
    'group block h-full rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-neon-cyan/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan';

  return job.certificate ? (
    <a
      href={job.certificate}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
};

const Experience = () => {
  const { t, cv } = useI18n();
  const headingReveal = useReveal();
  const cardReveal = useCardReveal(0.08);
  // Gather every `experience` section and flatten their content groups so that
  // Professional Experience, Teaching and Volunteering, and Certifications are
  // all rendered (matching by `type`, not by translatable label text).
  const groups = cv.sections
    .filter((s) => s.type === 'experience')
    .flatMap((s) => s.content ?? []) as ExperienceGroup[];

  return (
    <section id="experience" className="py-20 sm:py-28 px-5 sm:px-6 bg-dark-surface relative">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          {...headingReveal}
          className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 flex items-center"
        >
          {t.experience.title}
          <span className="ml-6 h-px bg-white/20 grow max-w-xs"></span>
        </motion.h2>

        <div className="space-y-14 sm:space-y-20">
          {groups.map((group, groupIndex) => {
            const isCertificates = group.entity.every((job) => !job.responsibilities?.length);
            return (
              <div key={group.name}>
                <h3 className="mb-6 sm:mb-8 flex items-center gap-3 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-neon-purple">
                  <span className="text-white/40">{String(groupIndex + 1).padStart(2, '0')}</span>
                  {group.name}
                  <span aria-hidden="true" className="h-px grow bg-white/10" />
                </h3>

                {isCertificates ? (
                  <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {group.entity.map((job, index) => (
                      <motion.li key={`${job.organization}-${job.dates}`} {...cardReveal(index)}>
                        <Certificate job={job} />
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  // Timeline: the rail hugs the left edge on phones so the copy keeps
                  // nearly the full width.
                  <ol className="relative space-y-10 sm:space-y-8 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-linear-to-b before:from-white/25 before:via-white/10 before:to-transparent sm:before:left-[7px]">
                    {group.entity.map((job, index) => (
                      <motion.li
                        key={`${job.organization}-${job.dates}`}
                        {...cardReveal(index, 'left')}
                        className="relative pl-6 sm:pl-10"
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1 h-[9px] w-[9px] rounded-full sm:top-6 sm:h-[15px] sm:w-[15px] sm:border-[3px] sm:border-dark-surface ${isCurrent(job.dates) ? 'bg-neon-green shadow-[0_0_10px_#00ff9f]' : 'bg-neon-magenta shadow-[0_0_10px_#ff00ff]'}`}
                        />
                        <Role job={job} />
                      </motion.li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
