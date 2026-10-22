import { useEffect, useEffectEvent, useState } from 'react';

type Segment = { text: string; className?: string };

type TypewriterProps = {
  /** Consecutive runs of text, each with its own styling (e.g. a gradient name). */
  segments: Segment[];
  /** Delay before the first keystroke, in ms. */
  startDelay?: number;
  /** Average time per keystroke, in ms; each one gets a small random jitter. */
  speed?: number;
  /** Show the whole text at once (prefers-reduced-motion). */
  instant?: boolean;
  onDone?: () => void;
};

/**
 * Types its text one character at a time behind a caret that blinks once the
 * line is complete. Untyped characters are rendered invisible, so the final
 * width is reserved from the first frame and nothing around it shifts.
 * Purely visual: the parent must expose the full text to assistive tech.
 */
const Typewriter = ({
  segments,
  startDelay = 0,
  speed = 75,
  instant = false,
  onDone,
}: TypewriterProps) => {
  const chars = segments.map((segment) => Array.from(segment.text));
  const starts = chars.map((_, i) => chars.slice(0, i).reduce((sum, c) => sum + c.length, 0));
  const text = segments.map((segment) => segment.text).join('');
  const total = Array.from(text).length;
  const [count, setCount] = useState(instant ? total : 0);
  const done = count >= total;
  const notifyDone = useEffectEvent(() => onDone?.());

  useEffect(() => {
    if (done) {
      notifyDone();
      return;
    }
    // Human-ish rhythm: jitter every keystroke and pause briefly after a space.
    const typedSpace = count > 0 && Array.from(text)[count - 1] === ' ';
    const delay =
      count === 0 ? startDelay : speed * (0.6 + Math.random() * 0.8) + (typedSpace ? 140 : 0);
    const id = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(id);
  }, [count, done, text, speed, startDelay]);

  const caret = (
    <span
      className={`ml-[0.06em] inline-block h-[0.82em] w-[0.08em] translate-y-[0.08em] rounded-full bg-neon-cyan shadow-[0_0_14px_#00f3ff] ${done ? 'motion-safe:animate-caret-blink' : ''}`}
    />
  );

  return (
    <span aria-hidden="true">
      {segments.map((segment, i) => {
        const start = starts[i];
        const shown = Math.min(Math.max(count - start, 0), chars[i].length);
        // The caret lives in the segment holding the next character (or the last one).
        const caretHere =
          count >= start && (count < start + chars[i].length || i === segments.length - 1);
        return (
          <span key={i} className={segment.className}>
            {chars[i].slice(0, shown).join('')}
            {caretHere && caret}
            <span className="invisible">{chars[i].slice(shown).join('')}</span>
          </span>
        );
      })}
    </span>
  );
};

export default Typewriter;
