import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Compass,
  Flame,
  Layers,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  COURSE_MAP,
  LEVELS,
  getGameDayResetDrills,
} from '../data/curriculum';
import type { AppView, Subtopic } from '../types/curriculum';
import { playTap } from '../utils/soundFx';
import { ScribbleText } from './ScribbleText';

interface HomeViewProps {
  athleteName: string;
  completedCount: number;
  totalSubtopics: number;
  overallPercent: number;
  xp: number;
  rankInfo: {
    title: string;
    xp: number;
    nextTitle: string | null;
    nextMinXp: number | null;
    levelProgress: number;
  };
  nextRecommended: Subtopic;
  levelStats: Array<{
    tier: 1 | 2 | 3 | 4;
    coursesCount: number;
    total: number;
    done: number;
    percent: number;
    isComplete: boolean;
  }>;
  completedSet: Set<string>;
  onOpenSubtopic: (subtopicId: string) => void;
  onNavigate: (view: AppView) => void;
  onOpenTrustBriefing: () => void;
  onLoadSampleJourney: () => void;
}

type HeadspaceId = 'locked' | 'wired' | 'scattered' | 'flat';

const HEADSPACE_OPTIONS: Array<{
  id: HeadspaceId;
  label: string;
  tag: string;
  advice: string;
  ctaLabel: string;
  targetSubtopicId?: string;
}> = [
  {
    id: 'locked',
    label: 'Locked In',
    tag: 'HIGH READINESS',
    advice:
      'Sharp mind, steady pulse. Keep stacking momentum on your next sequential drill.',
    ctaLabel: 'Attack Next Drill',
  },
  {
    id: 'wired',
    label: 'Nervous / Wired',
    tag: 'OVER-AMPED',
    advice:
      'Your body is loading energy—don’t fight it. Run a 4-round somatic downshift to settle into your sweet spot.',
    ctaLabel: 'Run Anxiety Downshift',
    targetSubtopicId: 'vis-managing-anxiety',
  },
  {
    id: 'scattered',
    label: 'Scattered',
    tag: 'NOISY MIND',
    advice:
      'Too many tabs open. Narrow your spotlight onto one physical target with the Focus Tunnel drill.',
    ctaLabel: 'Open Focus Tunnel',
    targetSubtopicId: 'staying-focus-conc',
  },
  {
    id: 'flat',
    label: 'Flat / Heavy',
    tag: 'LOW SPARK',
    advice:
      'Don’t wait for hype—move first. Use the 90-second Action-First flywheel to flip your state.',
    ctaLabel: 'Fire Up Action-First',
    targetSubtopicId: 'motiv-first',
  },
];

export function HomeView({
  athleteName,
  completedCount,
  totalSubtopics,
  overallPercent,
  xp,
  rankInfo,
  nextRecommended,
  levelStats,
  completedSet,
  onOpenSubtopic,
  onNavigate,
  onOpenTrustBriefing,
  onLoadSampleJourney,
}: HomeViewProps) {
  const [headspace, setHeadspace] = useState<HeadspaceId | null>(null);
  const nextCourse = COURSE_MAP[nextRecommended.courseId];
  const nextLevel = LEVELS[nextRecommended.tier];
  const gameDayDrills = getGameDayResetDrills();
  const activeHeadspace = HEADSPACE_OPTIONS.find((h) => h.id === headspace);

  return (
    <div className="hc-view hc-home">
      {/* Editorial Hero */}
      <section className="hc-hero" aria-labelledby="hc-hero-heading">
        <div className="hc-hero__content">
          <div className="hc-hero__eyebrow">
            <span className="hc-volt-dot" aria-hidden="true" />
            <span>HEAD COACH · MENTAL PERFORMANCE ACADEMY</span>
          </div>
          <h1 id="hc-hero-heading" className="hc-hero__title">
            TRAIN YOUR <ScribbleText>MIND</ScribbleText>
          </h1>
          <p className="hc-hero__lead">
            Games are won by whoever stays mentally engaged the longest. Ten
            connected courses across four levels—from bedrock habits right
            through to effortless flow.
          </p>

          <div className="hc-hero__actions">
            <button
              type="button"
              className="hc-btn hc-btn--volt hc-btn--lg"
              onClick={() => onOpenSubtopic(nextRecommended.id)}
            >
              <span>
                {completedCount === 0
                  ? 'Start Course 01'
                  : completedCount === totalSubtopics
                  ? 'Review Apex Mastery'
                  : 'Continue Next Drill'}
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hc-btn hc-btn--outline hc-btn--lg"
              onClick={() => onNavigate('map')}
            >
              <Layers size={17} aria-hidden="true" />
              <span>Open Mastery Map</span>
            </button>
            {completedCount === 0 && (
              <button
                type="button"
                className="hc-btn hc-btn--ghost"
                onClick={onLoadSampleJourney}
              >
                <Sparkles size={15} aria-hidden="true" />
                <span>Preview Active Athlete</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Telemetry Progress Panel */}
        <aside className="hc-telemetry" aria-label="Athlete mastery telemetry">
          <div className="hc-telemetry__top">
            <div>
              <span className="hc-mono-tag">ATHLETE STATUS</span>
              <div className="hc-telemetry__name">{athleteName}</div>
            </div>
            <div className="hc-telemetry__pct">{overallPercent}%</div>
          </div>

          <div className="hc-progress-track" aria-hidden="true">
            <div
              className="hc-progress-fill"
              style={{ width: `${Math.max(overallPercent, 2)}%` }}
            />
          </div>

          <div className="hc-telemetry__stats">
            <div className="hc-stat-box">
              <span className="hc-stat-box__val">
                {completedCount}/{totalSubtopics}
              </span>
              <span className="hc-stat-box__lbl">DRILLS COMPLETE</span>
            </div>
            <div className="hc-stat-box">
              <span className="hc-stat-box__val hc-stat-box__val--volt">
                {xp}
              </span>
              <span className="hc-stat-box__lbl">MENTAL XP</span>
            </div>
            <div className="hc-stat-box">
              <span className="hc-stat-box__val hc-stat-box__val--rank">
                <Trophy size={15} aria-hidden="true" />
                {rankInfo.title}
              </span>
              <span className="hc-stat-box__lbl">
                {rankInfo.nextTitle
                  ? `${rankInfo.nextMinXp! - xp} XP TO ${rankInfo.nextTitle}`
                  : 'MAX RANK'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="hc-trust-pill"
            onClick={onOpenTrustBriefing}
          >
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Bedrock: TRUST · Relational Safety Prerequisite</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </aside>
      </section>

      {/* Pre-Session Headspace Check-In */}
      <section className="hc-checkin" aria-labelledby="checkin-heading">
        <div className="hc-checkin__head">
          <div>
            <span className="hc-mono-tag">
              <Activity size={12} className="hc-inline-icon" aria-hidden="true" />{' '}
              10-SECOND PULSE CHECK
            </span>
            <h2 id="checkin-heading" className="hc-checkin__title">
              HOW&apos;S YOUR HEAD RIGHT NOW?
            </h2>
          </div>
          <span className="hc-mono-muted">TAP TO CALIBRATE YOUR SESSION</span>
        </div>

        <div className="hc-checkin__pills" role="group" aria-label="Current headspace">
          {HEADSPACE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`hc-checkin__pill ${
                headspace === opt.id ? 'is-active' : ''
              }`}
              onClick={() => {
                playTap();
                setHeadspace((prev) => (prev === opt.id ? null : opt.id));
              }}
            >
              <span>{opt.label}</span>
              <span className="hc-checkin__pill-tag">{opt.tag}</span>
            </button>
          ))}
        </div>

        {activeHeadspace && (
          <div className="hc-checkin__rx" aria-live="polite">
            <div className="hc-checkin__rx-copy">
              <span className="hc-mono-tag" style={{ color: '#DFFF00' }}>
                COACH PRESCRIPTION · {activeHeadspace.tag}
              </span>
              <p>{activeHeadspace.advice}</p>
            </div>
            <button
              type="button"
              className="hc-btn hc-btn--volt"
              onClick={() => {
                playTap();
                onOpenSubtopic(
                  activeHeadspace.targetSubtopicId ?? nextRecommended.id,
                );
              }}
            >
              <span>{activeHeadspace.ctaLabel}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      {/* Up Next Sequential Focus Card */}
      <section className="hc-section" aria-labelledby="up-next-heading">
        <div className="hc-section__header">
          <div>
            <span className="hc-mono-tag">YOUR SEQUENTIAL PATH</span>
            <h2 id="up-next-heading" className="hc-section__title">
              UP NEXT IN YOUR TRAINING
            </h2>
          </div>
          <button
            type="button"
            className="hc-link-btn"
            onClick={() => onNavigate('courses')}
          >
            <span>See all 10 courses</span>
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        <article
          className="hc-next-card"
          style={{ ['--tier-accent' as string]: nextLevel.accent }}
        >
          <div className="hc-next-card__left">
            <div className="hc-next-card__badges">
              <span
                className="hc-tier-chip"
                style={{
                  color: nextLevel.accentText,
                  borderColor: nextLevel.accentBorder,
                  backgroundColor: nextLevel.accentSoft,
                }}
              >
                LEVEL {nextLevel.tier} · {nextLevel.ownershipBadge}
              </span>
              <span className="hc-mono-muted">
                COURSE {nextCourse.number} · {nextCourse.title.toUpperCase()}
              </span>
            </div>
            <h3 className="hc-next-card__title">{nextRecommended.title}</h3>
            <p className="hc-next-card__desc">{nextRecommended.desc}</p>
            <div className="hc-next-card__meta">
              <span>{nextRecommended.format}</span>
              <span>•</span>
              <span>{nextRecommended.durationMin} min session</span>
              <span>•</span>
              <span>Drill #{nextRecommended.globalOrder} of 26</span>
            </div>
          </div>

          <div className="hc-next-card__right">
            <div className="hc-next-card__drill-preview">
              <span className="hc-mono-tag">ON-COURT DRILL</span>
              <strong>{nextRecommended.drillTitle}</strong>
              <p>{nextRecommended.drillSteps[0]}</p>
            </div>
            <button
              type="button"
              className="hc-btn hc-btn--volt hc-btn--full"
              onClick={() => onOpenSubtopic(nextRecommended.id)}
            >
              <span>Launch Drill Studio</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </article>
      </section>

      {/* 4 Levels Overview */}
      <section className="hc-section" aria-labelledby="four-levels-heading">
        <div className="hc-section__header">
          <div>
            <span className="hc-mono-tag">START WHERE YOU ARE</span>
            <h2 id="four-levels-heading" className="hc-section__title">
              FOUR LEVELS · YOU → ME → US → YOU
            </h2>
          </div>
          <button
            type="button"
            className="hc-link-btn"
            onClick={() => onNavigate('map')}
          >
            <Compass size={15} aria-hidden="true" />
            <span>Interactive Pyramid</span>
          </button>
        </div>

        <div className="hc-levels-grid">
          {levelStats.map((stat) => {
            const level = LEVELS[stat.tier];
            return (
              <button
                key={stat.tier}
                type="button"
                className="hc-level-card"
                style={{ ['--tier-accent' as string]: level.accent }}
                onClick={() => onNavigate('courses')}
              >
                <div className="hc-level-card__top">
                  <span className="hc-level-card__num">{level.code}</span>
                  <span
                    className="hc-level-card__owner"
                    style={{
                      color: level.accentText,
                      borderColor: level.accentBorder,
                      backgroundColor: level.accentSoft,
                    }}
                  >
                    {level.ownershipBadge} · {level.ownershipRole}
                  </span>
                </div>
                <h3 className="hc-level-card__title">{level.name}</h3>
                <p className="hc-level-card__sub">{level.ownershipDetail}</p>

                <div className="hc-level-card__footer">
                  <div className="hc-level-card__counts">
                    <span>{stat.coursesCount} courses</span>
                    <span>
                      {stat.done}/{stat.total} drills
                    </span>
                  </div>
                  <div className="hc-mini-bar" aria-hidden="true">
                    <div
                      className="hc-mini-bar__fill"
                      style={{
                        width: `${stat.percent}%`,
                        backgroundColor: level.accent,
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Game-Day Quick Resets */}
      <section className="hc-section" aria-labelledby="gameday-heading">
        <div className="hc-section__header">
          <div>
            <span className="hc-mono-tag">MATCH DAY TOOLKIT</span>
            <h2 id="gameday-heading" className="hc-section__title">
              <Zap size={20} className="hc-inline-icon" aria-hidden="true" />
              QUICK GAME-DAY RESETS
            </h2>
          </div>
          <span className="hc-mono-muted">USE BEFORE WARM-UP OR BETWEEN PLAYS</span>
        </div>

        <div className="hc-resets-grid">
          {gameDayDrills.map((drill) => {
            const done = completedSet.has(drill.id);
            return (
              <button
                key={drill.id}
                type="button"
                className="hc-reset-card"
                style={{ ['--tier-accent' as string]: drill.color }}
                onClick={() => onOpenSubtopic(drill.id)}
              >
                <div className="hc-reset-card__top">
                  <span className="hc-mono-tag" style={{ color: drill.color }}>
                    {drill.format.toUpperCase()}
                  </span>
                  {drill.pacer && (
                    <span className="hc-pacer-badge">
                      <Flame size={12} aria-hidden="true" /> PACER
                    </span>
                  )}
                </div>
                <h3 className="hc-reset-card__title">{drill.shortTitle}</h3>
                <p className="hc-reset-card__desc">{drill.summary}</p>
                <div className="hc-reset-card__bottom">
                  <span>{drill.durationMin} min</span>
                  <span className={done ? 'hc-done-text' : 'hc-open-text'}>
                    {done ? 'Completed ✓' : 'Open drill →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
