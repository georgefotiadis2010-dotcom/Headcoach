import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Clock,
  Lock,
  Star,
  Unlock,
} from 'lucide-react';
import { COURSES, COURSE_MAP, LEVELS, LEVEL_ORDER } from '../data/curriculum';
import type { Course, Subtopic } from '../types/curriculum';

interface CoursesViewProps {
  completedSet: Set<string>;
  strictSequence: boolean;
  onToggleStrictSequence: (strict: boolean) => void;
  getCourseStats: (course: Course) => {
    done: number;
    total: number;
    percent: number;
    isComplete: boolean;
  };
  isSubtopicUnlocked: (subtopic: Subtopic) => boolean;
  isCourseUnlocked: (course: Course) => boolean;
  onOpenSubtopic: (subtopicId: string) => void;
}

export function CoursesView({
  completedSet,
  strictSequence,
  onToggleStrictSequence,
  getCourseStats,
  isSubtopicUnlocked,
  isCourseUnlocked,
  onOpenSubtopic,
}: CoursesViewProps) {
  const [tierFilter, setTierFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');

  const visibleCourses =
    tierFilter === 'all'
      ? COURSES
      : COURSES.filter((course) => course.tier === tierFilter);

  return (
    <div className="hc-view hc-courses">
      <header className="hc-page-head">
        <div>
          <span className="hc-mono-tag">CURRICULUM · 01 THROUGH 10</span>
          <h1 className="hc-page-title">THE 10 CONNECTED COURSES</h1>
          <p className="hc-page-lead">
            Every course builds directly onto the next—from foundational habits
            in Level 1 through strategic systems, mental conditioning, and apex
            flow.
          </p>
        </div>

        <div className="hc-sequence-toggle">
          <button
            type="button"
            className={`hc-seg-btn ${!strictSequence ? 'is-active' : ''}`}
            onClick={() => onToggleStrictSequence(false)}
          >
            <Unlock size={14} aria-hidden="true" />
            <span>Guided (Explore Any)</span>
          </button>
          <button
            type="button"
            className={`hc-seg-btn ${strictSequence ? 'is-active' : ''}`}
            onClick={() => onToggleStrictSequence(true)}
          >
            <Lock size={14} aria-hidden="true" />
            <span>Sequential Lock</span>
          </button>
        </div>
      </header>

      {/* Level Filter Rail */}
      <div className="hc-filter-rail" role="group" aria-label="Filter courses by level">
        <button
          type="button"
          className={`hc-filter-btn ${tierFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setTierFilter('all')}
        >
          All Levels (10)
        </button>
        {LEVEL_ORDER.map((tier) => {
          const lvl = LEVELS[tier];
          const count = COURSES.filter((c) => c.tier === tier).length;
          return (
            <button
              key={tier}
              type="button"
              className={`hc-filter-btn ${
                tierFilter === tier ? 'is-active' : ''
              }`}
              style={{ ['--tier-accent' as string]: lvl.accent }}
              onClick={() => setTierFilter(tier)}
            >
              <span
                className="hc-tier-dot"
                style={{ backgroundColor: lvl.accent }}
                aria-hidden="true"
              />
              <span>
                L{tier} {lvl.shortName} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Sequential Course Stack */}
      <div className="hc-course-list">
        {visibleCourses.map((course, idx) => {
          const level = LEVELS[course.tier];
          const stats = getCourseStats(course);
          const courseUnlocked = isCourseUnlocked(course);
          const nextCourse = course.leadsTo ? COURSE_MAP[course.leadsTo] : null;
          const nextIncompleteSub =
            course.subtopics.find((s) => !completedSet.has(s.id)) ??
            course.subtopics[0];

          return (
            <div key={course.id} className="hc-course-sequence-item">
              <article
                className={`hc-course-card ${
                  course.featured ? 'is-featured' : ''
                } ${!courseUnlocked ? 'is-locked' : ''}`}
                style={{ ['--tier-accent' as string]: level.accent }}
              >
                <div className="hc-course-card__header">
                  <div className="hc-course-card__num-col">
                    <span className="hc-course-card__num">{course.number}</span>
                    <span
                      className="hc-course-card__lvl"
                      style={{ color: level.accentText }}
                    >
                      L{course.tier} · {level.ownershipBadge}
                    </span>
                  </div>

                  <div className="hc-course-card__info">
                    <div className="hc-course-card__eyebrow">
                      <span style={{ color: level.accentText }}>
                        {level.name.toUpperCase()}
                      </span>
                      {course.featured && (
                        <span className="hc-featured-star">
                          <Star size={11} aria-hidden="true" />{' '}
                          {course.featuredLabel}
                        </span>
                      )}
                      {stats.isComplete && (
                        <span className="hc-complete-pill">COMPLETE ✓</span>
                      )}
                    </div>
                    <h2 className="hc-course-card__title">{course.title}</h2>
                    <p className="hc-course-card__subtitle">
                      {course.subtitle} — {course.connectionNote}
                    </p>
                  </div>

                  <div className="hc-course-card__cta">
                    <div className="hc-course-card__progress">
                      <span>
                        {stats.done}/{stats.total} drills
                      </span>
                      <div className="hc-mini-bar" aria-hidden="true">
                        <div
                          className="hc-mini-bar__fill"
                          style={{
                            width: `${stats.percent}%`,
                            backgroundColor: level.accent,
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`hc-btn ${
                        courseUnlocked ? 'hc-btn--volt' : 'hc-btn--ghost'
                      }`}
                      disabled={!courseUnlocked}
                      onClick={() =>
                        nextIncompleteSub && onOpenSubtopic(nextIncompleteSub.id)
                      }
                    >
                      {!courseUnlocked ? (
                        <>
                          <Lock size={14} aria-hidden="true" />
                          <span>Locked</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {stats.done === 0
                              ? 'Start Course'
                              : stats.isComplete
                              ? 'Review Course'
                              : 'Continue'}
                          </span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Native <details> Subtopic Accordion */}
                <details
                  className="hc-course-accordion"
                  open={idx === 0 || (stats.done > 0 && !stats.isComplete)}
                >
                  <summary className="hc-course-accordion__summary">
                    <span>
                      {course.subtopics.length} Subtopics &amp; Training Drills
                    </span>
                  </summary>

                  <div className="hc-course-accordion__list">
                    {course.subtopics.map((sub) => {
                      const done = completedSet.has(sub.id);
                      const unlocked = isSubtopicUnlocked(sub);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          className={`hc-sub-row ${done ? 'is-done' : ''} ${
                            !unlocked ? 'is-locked' : ''
                          }`}
                          disabled={!unlocked}
                          onClick={() => unlocked && onOpenSubtopic(sub.id)}
                        >
                          <span className="hc-sub-row__check" aria-hidden="true">
                            {done ? (
                              <Check size={14} />
                            ) : !unlocked ? (
                              <Lock size={13} />
                            ) : (
                              <span>0{sub.indexInCourse}</span>
                            )}
                          </span>
                          <span className="hc-sub-row__body">
                            <strong>{sub.title}</strong>
                            <small>{sub.summary}</small>
                          </span>
                          <span className="hc-sub-row__meta">
                            <span className="hc-format-tag">{sub.format}</span>
                            <span className="hc-time-tag">
                              <Clock size={12} aria-hidden="true" />
                              {sub.durationMin}m
                            </span>
                            <ArrowRight size={15} aria-hidden="true" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </details>
              </article>

              {nextCourse && tierFilter === 'all' && (
                <div className="hc-sequence-connector" aria-hidden="true">
                  <ArrowDown size={14} />
                  <span>
                    LEADS TO COURSE {nextCourse.number}:{' '}
                    {nextCourse.title.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
