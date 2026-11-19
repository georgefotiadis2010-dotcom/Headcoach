import {
  ArrowRight,
  BookOpen,
  RotateCcw,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  ALL_SUBTOPICS,
  COURSE_MAP,
  LEVELS,
} from '../data/curriculum';
import type { AthleteProgress } from '../types/curriculum';

interface JournalViewProps {
  progress: AthleteProgress;
  completedCount: number;
  totalSubtopics: number;
  levelStats: Array<{
    tier: 1 | 2 | 3 | 4;
    coursesCount: number;
    total: number;
    done: number;
    percent: number;
    isComplete: boolean;
  }>;
  onUpdateProfile: (name: string, sport: string) => void;
  onOpenSubtopic: (subtopicId: string) => void;
  onLoadSampleJourney: () => void;
  onRequestReset: () => void;
}

export function JournalView({
  progress,
  completedCount,
  totalSubtopics,
  levelStats,
  onUpdateProfile,
  onOpenSubtopic,
  onLoadSampleJourney,
  onRequestReset,
}: JournalViewProps) {
  const savedCues = ALL_SUBTOPICS.filter(
    (s) => (progress.gameDayCues[s.id] ?? '').trim().length > 0,
  );
  const savedReflections = ALL_SUBTOPICS.filter(
    (s) => (progress.reflections[s.id] ?? '').trim().length > 0,
  );

  return (
    <div className="hc-view hc-journal">
      <header className="hc-page-head">
        <div>
          <span className="hc-mono-tag">ATHLETE LOCKER-ROOM PLAYBOOK</span>
          <h1 className="hc-page-title">FIELD JOURNAL &amp; GAME-DAY CUES</h1>
          <p className="hc-page-lead">
            Your personal collection of active self-talk triggers, strengths
            anchors, and post-session reflections—built across all 10 courses.
          </p>
        </div>

        <div className="hc-journal-actions">
          <button
            type="button"
            className="hc-btn hc-btn--outline"
            onClick={onLoadSampleJourney}
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>Load Sample Athlete</span>
          </button>
          <button
            type="button"
            className="hc-btn hc-btn--ghost"
            onClick={onRequestReset}
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Reset Data</span>
          </button>
        </div>
      </header>

      {/* Athlete Profile + Level Breakdown */}
      <div className="hc-journal-top-grid">
        <section className="hc-card-block" aria-labelledby="profile-heading">
          <div className="hc-card-block__eyebrow-row">
            <UserCheck size={16} aria-hidden="true" />
            <span className="hc-mono-tag">ATHLETE PROFILE</span>
          </div>
          <h2 id="profile-heading" className="hc-card-block__title">
            PERSONALIZE YOUR PLAYBOOK
          </h2>

          <div className="hc-profile-form">
            <div className="hc-field">
              <label htmlFor="athlete-name-input" className="hc-field__label">
                Athlete Name
              </label>
              <input
                id="athlete-name-input"
                type="text"
                className="hc-input"
                value={progress.athleteName}
                onChange={(e) =>
                  onUpdateProfile(e.target.value, progress.sport)
                }
                placeholder="e.g. Jordan"
              />
            </div>

            <div className="hc-field">
              <label htmlFor="athlete-sport-input" className="hc-field__label">
                Sport / Squad
              </label>
              <input
                id="athlete-sport-input"
                type="text"
                className="hc-input"
                value={progress.sport}
                onChange={(e) =>
                  onUpdateProfile(progress.athleteName, e.target.value)
                }
                placeholder="e.g. U18 National Tennis / AFL Academy"
              />
            </div>
          </div>
        </section>

        <section className="hc-card-block" aria-labelledby="breakdown-heading">
          <span className="hc-mono-tag">MASTERY PROGRESS</span>
          <h2 id="breakdown-heading" className="hc-card-block__title">
            {completedCount} OF {totalSubtopics} DRILLS LOCKED IN
          </h2>

          <div className="hc-breakdown-list">
            {levelStats.map((stat) => {
              const lvl = LEVELS[stat.tier];
              return (
                <div key={stat.tier} className="hc-breakdown-row">
                  <div className="hc-breakdown-row__top">
                    <span>
                      <strong>L{stat.tier}</strong> · {lvl.name} (
                      {lvl.ownershipBadge})
                    </span>
                    <span className="hc-mono-muted">
                      {stat.done}/{stat.total} ({stat.percent}%)
                    </span>
                  </div>
                  <div className="hc-mini-bar" aria-hidden="true">
                    <div
                      className="hc-mini-bar__fill"
                      style={{
                        width: `${stat.percent}%`,
                        backgroundColor: lvl.accent,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Game-Day Cue Wall */}
      <section className="hc-section" aria-labelledby="cue-wall-heading">
        <div className="hc-section__header">
          <div>
            <span className="hc-mono-tag">PRE-MATCH SNAPSHOT</span>
            <h2 id="cue-wall-heading" className="hc-section__title">
              <Zap size={18} className="hc-inline-icon" aria-hidden="true" />
              YOUR GAME-DAY CUE BOARD ({savedCues.length})
            </h2>
          </div>
        </div>

        {savedCues.length === 0 ? (
          <div className="hc-empty-state">
            <p>
              No game-day cues saved yet. Complete any drill to lock in your
              personal 3-word execution triggers—or tap{' '}
              <strong>Load Sample Athlete</strong> to preview a populated cue
              board.
            </p>
          </div>
        ) : (
          <div className="hc-cue-grid">
            {savedCues.map((sub) => {
              const course = COURSE_MAP[sub.courseId];
              return (
                <button
                  key={sub.id}
                  type="button"
                  className="hc-cue-card"
                  style={{ ['--tier-accent' as string]: sub.color }}
                  onClick={() => onOpenSubtopic(sub.id)}
                >
                  <span className="hc-mono-tag" style={{ color: sub.color }}>
                    COURSE {course.number} · {sub.cuePrompt.toUpperCase()}
                  </span>
                  <strong className="hc-cue-card__quote">
                    “{progress.gameDayCues[sub.id]}”
                  </strong>
                  <span className="hc-cue-card__foot">
                    <span>{sub.shortTitle}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Field Reflections */}
      <section className="hc-section" aria-labelledby="reflections-heading">
        <div className="hc-section__header">
          <div>
            <span className="hc-mono-tag">TRAINING TELEMETRY</span>
            <h2 id="reflections-heading" className="hc-section__title">
              <BookOpen size={18} className="hc-inline-icon" aria-hidden="true" />
              SAVED REFLECTIONS ({savedReflections.length})
            </h2>
          </div>
        </div>

        {savedReflections.length === 0 ? (
          <div className="hc-empty-state">
            <p>
              Your reflections from each subtopic will appear here so you and
              your coach can review patterns across the season.
            </p>
          </div>
        ) : (
          <div className="hc-reflection-list">
            {savedReflections.map((sub) => {
              const course = COURSE_MAP[sub.courseId];
              return (
                <article
                  key={sub.id}
                  className="hc-reflection-card"
                  style={{ ['--tier-accent' as string]: sub.color }}
                >
                  <div className="hc-reflection-card__top">
                    <span className="hc-mono-tag" style={{ color: sub.color }}>
                      COURSE {course.number} · {course.title.toUpperCase()} —{' '}
                      {sub.shortTitle.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      className="hc-link-btn"
                      onClick={() => onOpenSubtopic(sub.id)}
                    >
                      <span>Edit in Drill</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="hc-reflection-card__prompt">
                    {sub.reflectionPrompt}
                  </p>
                  <p className="hc-reflection-card__body">
                    {progress.reflections[sub.id]}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
