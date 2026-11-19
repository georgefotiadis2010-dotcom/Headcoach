import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Lock,
  RotateCcw,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { LEVELS, getCoursesByTier } from '../data/curriculum';
import type { Course, Subtopic, TierId } from '../types/curriculum';

interface MasteryMapViewProps {
  completedSet: Set<string>;
  getCourseStats: (course: Course) => {
    done: number;
    total: number;
    percent: number;
    isComplete: boolean;
  };
  isSubtopicUnlocked: (subtopic: Subtopic) => boolean;
  onOpenSubtopic: (subtopicId: string) => void;
  onOpenTrustBriefing: () => void;
}

const PYRAMID_TIERS: Array<4 | 3 | 2 | 1> = [4, 3, 2, 1];

export function MasteryMapView({
  completedSet,
  getCourseStats,
  isSubtopicUnlocked,
  onOpenSubtopic,
  onOpenTrustBriefing,
}: MasteryMapViewProps) {
  const [focusedTier, setFocusedTier] = useState<TierId | null>(null);
  const activeNarrativeTier: TierId = focusedTier ?? 1;
  const narrative = LEVELS[activeNarrativeTier];

  const handleStageSelect = (tier: TierId) => {
    setFocusedTier((prev) => (prev === tier ? null : tier));
  };

  return (
    <div className="hc-view hc-map">
      {/* Stage Narrative Banner (evolved from headcoach.com.au/pages/mastery) */}
      <section
        className="hc-narrative"
        style={{
          borderColor: narrative.accentBorder,
          ['--tier-accent' as string]: narrative.accent,
        }}
        aria-live="polite"
      >
        <div className="hc-narrative__body">
          <div
            className="hc-narrative__badge"
            style={{
              backgroundColor: narrative.accentSoft,
              borderColor: narrative.accentBorder,
              color: narrative.accentText,
            }}
          >
            {narrative.ownershipBadge}
          </div>
          <div className="hc-narrative__copy">
            <span
              className="hc-mono-tag"
              style={{ color: narrative.accentText }}
            >
              {narrative.stageTag}
            </span>
            <h1 className="hc-narrative__title">{narrative.narrativeTitle}</h1>
            <p className="hc-narrative__desc">{narrative.narrativeDesc}</p>
          </div>
        </div>

        <button
          type="button"
          className="hc-btn hc-btn--ghost"
          onClick={() => setFocusedTier(null)}
          disabled={focusedTier === null}
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>{focusedTier === null ? 'All Levels' : 'Reset Focus'}</span>
        </button>
      </section>

      {/* Main Two-Column Mastery Workspace */}
      <div className="hc-map-workspace">
        {/* Stepped Truncated Pyramid */}
        <section
          className="hc-pyramid-panel"
          aria-label="Head Coach Mastery Pyramid"
        >
          <div className="hc-pyramid-bar">
            <span>
              Tap any course block to expand its subtopics. Launch any subtopic
              into the Drill Studio.
            </span>
            <span className="hc-mono-tag">4 LEVELS · 10 COURSES · 26 DRILLS</span>
          </div>

          <div className="hc-pyramid-stack">
            {PYRAMID_TIERS.map((tier) => {
              const level = LEVELS[tier];
              const courses = getCoursesByTier(tier);
              const isDimmed =
                focusedTier !== null && focusedTier !== tier;
              const isFocused = focusedTier === tier;
              const tierSubs = courses.flatMap((c) => c.subtopics);
              const tierDone = tierSubs.filter((s) =>
                completedSet.has(s.id),
              ).length;

              return (
                <div
                  key={tier}
                  className={`hc-tier-band hc-tier-band--${tier} ${
                    isDimmed ? 'is-dimmed' : ''
                  } ${isFocused ? 'is-focused' : ''}`}
                  style={{
                    ['--tier-accent' as string]: level.accent,
                    ['--tier-soft' as string]: level.accentSoft,
                    ['--tier-border' as string]: level.accentBorder,
                  }}
                >
                  <div className="hc-tier-band__header">
                    <button
                      type="button"
                      className="hc-tier-band__focus-btn"
                      onClick={() => handleStageSelect(tier)}
                    >
                      <span
                        className="hc-tier-dot"
                        style={{ backgroundColor: level.accent }}
                        aria-hidden="true"
                      />
                      <strong>
                        LEVEL {tier}: {level.name.toUpperCase()} ({level.ownershipBadge})
                      </strong>
                    </button>
                    <span className="hc-mono-muted">
                      {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} ·{' '}
                      {tierDone}/{tierSubs.length} Done
                    </span>
                  </div>

                  <div
                    className={`hc-tier-courses hc-tier-courses--cols-${courses.length}`}
                  >
                    {courses.map((course) => {
                      const stats = getCourseStats(course);
                      return (
                        <details
                          key={course.id}
                          className={`hc-pyramid-course ${
                            course.featured ? 'is-featured' : ''
                          } ${stats.isComplete ? 'is-complete' : ''}`}
                        >
                          <summary className="hc-pyramid-course__summary">
                            <div className="hc-pyramid-course__main">
                              <div className="hc-pyramid-course__top-row">
                                <span className="hc-course-num">
                                  {course.number}
                                </span>
                                {course.featured && (
                                  <span className="hc-featured-star">
                                    <Star size={11} aria-hidden="true" /> CORE
                                  </span>
                                )}
                                <span className="hc-course-count">
                                  {stats.done}/{stats.total}
                                </span>
                              </div>
                              <span className="hc-pyramid-course__title">
                                {course.title}
                              </span>
                              <span className="hc-pyramid-course__sub">
                                {course.subtitle}
                              </span>
                            </div>
                          </summary>

                          <div className="hc-pyramid-course__subs">
                            {course.subtopics.map((sub) => {
                              const done = completedSet.has(sub.id);
                              const unlocked = isSubtopicUnlocked(sub);
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  className={`hc-sub-btn ${
                                    done ? 'is-done' : ''
                                  } ${!unlocked ? 'is-locked' : ''}`}
                                  onClick={() => unlocked && onOpenSubtopic(sub.id)}
                                  disabled={!unlocked}
                                >
                                  <span className="hc-sub-btn__status" aria-hidden="true">
                                    {done ? (
                                      <Check size={13} />
                                    ) : !unlocked ? (
                                      <Lock size={12} />
                                    ) : (
                                      <ArrowRight size={13} />
                                    )}
                                  </span>
                                  <span className="hc-sub-btn__copy">
                                    <strong>{sub.title}</strong>
                                    <small>{sub.summary}</small>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* TRUST Bedrock Base */}
            <button
              type="button"
              className={`hc-trust-bedrock ${
                focusedTier !== null && focusedTier !== 0 ? 'is-dimmed' : ''
              } ${focusedTier === 0 ? 'is-focused' : ''}`}
              onClick={() => {
                handleStageSelect(0);
                onOpenTrustBriefing();
              }}
            >
              <div className="hc-trust-bedrock__left">
                <ShieldCheck size={20} aria-hidden="true" />
                <div>
                  <span className="hc-mono-tag">BEDROCK · LEVEL 00</span>
                  <strong>TRUST — RELATIONAL SAFETY & PREREQUISITE</strong>
                </div>
              </div>
              <span className="hc-trust-bedrock__cta">
                Read Bedrock Principle →
              </span>
            </button>
          </div>
        </section>

        {/* TRUST Evolution Ownership Rail */}
        <aside
          className="hc-evolution-rail"
          aria-label="TRUST Evolution Level Ownership"
        >
          <div className="hc-evolution-rail__head">
            <span className="hc-mono-tag">TRUST EVOLUTION</span>
            <h2>LEVEL OWNERSHIP</h2>
            <p>Tap any stage to isolate it on the pyramid.</p>
          </div>

          <div className="hc-evolution-rail__stages">
            {([4, 3, 2, 1, 0] as TierId[]).map((tier) => {
              const lvl = LEVELS[tier];
              const active = focusedTier === tier;
              return (
                <button
                  key={tier}
                  type="button"
                  className={`hc-owner-btn ${active ? 'is-active' : ''}`}
                  style={{
                    ['--tier-accent' as string]: lvl.accent,
                    ['--tier-soft' as string]: lvl.accentSoft,
                    ['--tier-border' as string]: lvl.accentBorder,
                  }}
                  aria-pressed={active}
                  onClick={() => handleStageSelect(tier)}
                >
                  <div className="hc-owner-btn__top">
                    <span className="hc-mono-tag">
                      {tier === 0 ? 'BEDROCK' : `LEVEL ${tier}`}
                    </span>
                    <span
                      className="hc-owner-btn__badge"
                      style={{ color: lvl.accentText }}
                    >
                      {lvl.ownershipBadge} · {lvl.ownershipRole}
                    </span>
                  </div>
                  <strong>{lvl.name}</strong>
                  <small>{lvl.ownershipDetail}</small>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
