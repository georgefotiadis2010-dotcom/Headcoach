import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Play,
  Sparkles,
  Video,
} from 'lucide-react';
import { ALL_SUBTOPICS, COURSE_MAP, LEVELS } from '../data/curriculum';
import type { Subtopic } from '../types/curriculum';
import { BreathingPacer } from './BreathingPacer';
import { DrillBlueprint } from './DrillBlueprint';

interface LessonStudioProps {
  subtopic: Subtopic;
  isCompleted: boolean;
  checkedSteps: number[];
  reflection: string;
  gameDayCue: string;
  completedSet: Set<string>;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
  onToggleStep: (stepIndex: number) => void;
  onSaveReflection: (text: string) => void;
  onSaveCue: (cue: string) => void;
  onToggleComplete: () => void;
  onCompleteAndNext: (nextId: string | null) => void;
}

export function LessonStudio({
  subtopic,
  isCompleted,
  checkedSteps,
  reflection,
  gameDayCue,
  completedSet,
  onBack,
  onSelectSubtopic,
  onToggleStep,
  onSaveReflection,
  onSaveCue,
  onToggleComplete,
  onCompleteAndNext,
}: LessonStudioProps) {
  const [mediaMode, setMediaMode] = useState<'blueprint' | 'video'>('blueprint');
  const [videoPlaying, setVideoPlaying] = useState(false);

  const course = COURSE_MAP[subtopic.courseId];
  const level = LEVELS[subtopic.tier];
  const currentIdx = ALL_SUBTOPICS.findIndex((s) => s.id === subtopic.id);
  const prevSub = currentIdx > 0 ? ALL_SUBTOPICS[currentIdx - 1] : null;
  const nextSub =
    currentIdx >= 0 && currentIdx < ALL_SUBTOPICS.length - 1
      ? ALL_SUBTOPICS[currentIdx + 1]
      : null;

  const allStepsChecked = checkedSteps.length === subtopic.drillSteps.length;

  return (
    <div
      className="hc-view hc-lesson"
      style={{
        ['--tier-accent' as string]: level.accent,
        ['--tier-soft' as string]: level.accentSoft,
        ['--tier-border' as string]: level.accentBorder,
      }}
    >
      {/* Top Lesson Bar */}
      <div className="hc-lesson-topbar">
        <button type="button" className="hc-link-btn" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Curriculum</span>
        </button>

        <div className="hc-lesson-topbar__meta">
          <span className="hc-mono-tag" style={{ color: level.accentText }}>
            COURSE {course.number} · {course.title.toUpperCase()}
          </span>
          <span className="hc-mono-muted">
            DRILL {subtopic.globalOrder} OF {ALL_SUBTOPICS.length}
          </span>
        </div>
      </div>

      {/* Sibling Subtopics Strip within Current Course */}
      <nav
        className="hc-sibling-strip"
        aria-label={`Subtopics in ${course.title}`}
      >
        {course.subtopics.map((sib) => {
          const active = sib.id === subtopic.id;
          const done = completedSet.has(sib.id);
          return (
            <button
              key={sib.id}
              type="button"
              className={`hc-sibling-pill ${active ? 'is-active' : ''} ${
                done ? 'is-done' : ''
              }`}
              aria-current={active ? 'step' : undefined}
              onClick={() => {
                setVideoPlaying(false);
                onSelectSubtopic(sib.id);
              }}
            >
              <span className="hc-sibling-pill__num">
                {done ? <Check size={12} aria-hidden="true" /> : `0${sib.indexInCourse}`}
              </span>
              <span>{sib.shortTitle}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Studio Grid */}
      <div className="hc-lesson-grid">
        {/* Left Column: Media Stage + Coaching Briefing */}
        <div className="hc-lesson-main">
          <header className="hc-lesson-header">
            <div className="hc-lesson-header__tags">
              <span
                className="hc-tier-chip"
                style={{
                  color: level.accentText,
                  borderColor: level.accentBorder,
                  backgroundColor: level.accentSoft,
                }}
              >
                {subtopic.tag}
              </span>
              <span className="hc-format-tag">{subtopic.format}</span>
              <span className="hc-time-tag">
                <Clock size={12} aria-hidden="true" />
                {subtopic.durationMin} min
              </span>
            </div>

            <h1 className="hc-lesson-title">{subtopic.title}</h1>
            <p className="hc-lesson-desc">{subtopic.desc}</p>
          </header>

          {/* Media Stage with Blueprint / Coach Video Switcher */}
          <section className="hc-media-card" aria-label="Lesson visual and briefing">
            <div className="hc-media-card__bar">
              <div className="hc-media-toggle" role="group" aria-label="Media view mode">
                <button
                  type="button"
                  className={`hc-media-tab ${
                    mediaMode === 'blueprint' ? 'is-active' : ''
                  }`}
                  onClick={() => setMediaMode('blueprint')}
                >
                  <ImageIcon size={14} aria-hidden="true" />
                  <span>Drill Blueprint</span>
                </button>
                <button
                  type="button"
                  className={`hc-media-tab ${
                    mediaMode === 'video' ? 'is-active' : ''
                  }`}
                  onClick={() => setMediaMode('video')}
                >
                  <Video size={14} aria-hidden="true" />
                  <span>Coach Briefing ({subtopic.videoPreviewDuration})</span>
                </button>
              </div>
              <span className="hc-mono-muted">{level.ownershipBadge} STAGE</span>
            </div>

            {mediaMode === 'blueprint' ? (
              <DrillBlueprint
                kind={subtopic.blueprintKind}
                color={subtopic.color}
                label={subtopic.blueprintLabel}
                courseNumber={course.number}
              />
            ) : (
              <div className="hc-video-stage">
                {videoPlaying ? (
                  <div className="hc-video-playing">
                    <span className="hc-mono-tag" style={{ color: '#DFFF00' }}>
                      COACH BRIEFING READY FOR YOUR VIDEO UPLOAD
                    </span>
                    <h3>{subtopic.title} — On-Court Walkthrough</h3>
                    <p>
                      Connect your Vimeo, Mux, or hosted MP4 briefing for{' '}
                      <strong>{course.title}</strong> here. Duration:{' '}
                      {subtopic.videoPreviewDuration}.
                    </p>
                    <div className="hc-video-chapters">
                      <span>00:00 Core Principle</span>
                      <span>01:30 Match Example</span>
                      <span>03:10 Training Drill Setup</span>
                    </div>
                    <button
                      type="button"
                      className="hc-btn hc-btn--outline"
                      onClick={() => setVideoPlaying(false)}
                    >
                      Close Preview
                    </button>
                  </div>
                ) : (
                  <div className="hc-video-poster">
                    <span className="hc-mono-tag">
                      HEAD COACH · VIDEO BRIEFING ({subtopic.videoPreviewDuration})
                    </span>
                    <h3>{subtopic.blueprintLabel}</h3>
                    <p>{subtopic.summary}</p>
                    <button
                      type="button"
                      className="hc-btn hc-btn--volt"
                      onClick={() => setVideoPlaying(true)}
                    >
                      <Play size={16} aria-hidden="true" />
                      <span>Play Coach Briefing</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Key Coaching Takeaways */}
          <section className="hc-card-block" aria-labelledby="principles-heading">
            <span className="hc-mono-tag">KEY COACHING PRINCIPLES</span>
            <h2 id="principles-heading" className="hc-card-block__title">
              WHAT SEPARATES ELITE PERFORMERS
            </h2>
            <ul className="hc-principles-list">
              {subtopic.bullets.map((bullet, i) => (
                <li key={i}>
                  <span className="hc-principles-list__idx">0{i + 1}</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Optional Interactive Breathing / Reset Pacer */}
          {subtopic.pacer && (
            <BreathingPacer config={subtopic.pacer} accent={subtopic.color} />
          )}
        </div>

        {/* Right Column: Actionable Drill + Field Reflection + Completion */}
        <aside className="hc-lesson-side" aria-label="On-court drill and athlete journal">
          {/* Interactive 3-Step On-Court Drill */}
          <section className="hc-card-block hc-drill-card">
            <div className="hc-drill-card__head">
              <div>
                <span className="hc-mono-tag" style={{ color: '#DFFF00' }}>
                  ACTIONABLE TRAINING DRILL
                </span>
                <h2 className="hc-card-block__title">{subtopic.drillTitle}</h2>
              </div>
              <span className="hc-step-counter">
                {checkedSteps.length}/{subtopic.drillSteps.length}
              </span>
            </div>

            <div className="hc-checklist">
              {subtopic.drillSteps.map((step, idx) => {
                const checked = checkedSteps.includes(idx);
                return (
                  <label
                    key={idx}
                    className={`hc-check-item ${checked ? 'is-checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleStep(idx)}
                    />
                    <span className="hc-check-item__box" aria-hidden="true">
                      {checked && <Check size={13} />}
                    </span>
                    <span className="hc-check-item__text">{step}</span>
                  </label>
                );
              })}
            </div>

            {allStepsChecked && (
              <div className="hc-all-checked-note">
                <Sparkles size={14} aria-hidden="true" />
                <span>All drill steps executed. Lock in your cue below.</span>
              </div>
            )}
          </section>

          {/* Athlete Field Journal & Cue Card */}
          <section className="hc-card-block hc-journal-input-card">
            <div className="hc-journal-input-card__head">
              <span className="hc-mono-tag">ATHLETE FIELD JOURNAL</span>
              <span className="hc-autosave-tag">
                <BookmarkCheck size={13} aria-hidden="true" /> Auto-saved
              </span>
            </div>

            <div className="hc-field">
              <label htmlFor={`cue-${subtopic.id}`} className="hc-field__label">
                {subtopic.cuePrompt}
              </label>
              <input
                id={`cue-${subtopic.id}`}
                type="text"
                className="hc-input"
                value={gameDayCue}
                onChange={(e) => onSaveCue(e.target.value)}
                placeholder={subtopic.cuePlaceholder}
              />
            </div>

            <div className="hc-field">
              <label
                htmlFor={`reflection-${subtopic.id}`}
                className="hc-field__label"
              >
                {subtopic.reflectionPrompt}
              </label>
              <textarea
                id={`reflection-${subtopic.id}`}
                rows={4}
                className="hc-textarea"
                value={reflection}
                onChange={(e) => onSaveReflection(e.target.value)}
                placeholder="Write a sharp note for your next training or game..."
              />
            </div>
          </section>

          {/* Completion & Sequential Progression Actions */}
          <section className="hc-complete-panel">
            <button
              type="button"
              className="hc-btn hc-btn--volt hc-btn--full hc-btn--lg"
              onClick={() => onCompleteAndNext(nextSub ? nextSub.id : null)}
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>
                {nextSub
                  ? isCompleted
                    ? `Next: ${nextSub.shortTitle}`
                    : 'Complete & Next Drill'
                  : 'Complete Final Apex Drill'}
              </span>
              {nextSub && <ArrowRight size={16} aria-hidden="true" />}
            </button>

            <div className="hc-complete-panel__secondary">
              <button
                type="button"
                className="hc-btn hc-btn--ghost"
                onClick={onToggleComplete}
              >
                {isCompleted ? 'Completed ✓ (Undo)' : 'Mark Complete Only'}
              </button>

              <div className="hc-prev-next">
                <button
                  type="button"
                  className="hc-btn hc-btn--outline"
                  disabled={!prevSub}
                  onClick={() => prevSub && onSelectSubtopic(prevSub.id)}
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  className="hc-btn hc-btn--outline"
                  disabled={!nextSub}
                  onClick={() => nextSub && onSelectSubtopic(nextSub.id)}
                >
                  <span>Next</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
