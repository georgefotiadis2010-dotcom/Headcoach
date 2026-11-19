import { useState } from 'react';
import {
  BookOpen,
  Compass,
  Home,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { CoursesView } from './components/CoursesView';
import { HomeView } from './components/HomeView';
import { JournalView } from './components/JournalView';
import { LessonStudio } from './components/LessonStudio';
import { MasteryMapView } from './components/MasteryMapView';
import { NativeDialog } from './components/NativeDialog';
import { ALL_SUBTOPICS, LEVELS, SUBTOPIC_MAP } from './data/curriculum';
import { useAthleteProgress } from './hooks/useAthleteProgress';
import type { AppView } from './types/curriculum';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [returnView, setReturnView] = useState<Exclude<AppView, 'lesson'>>('courses');
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>(
    ALL_SUBTOPICS[0].id,
  );
  const [trustDialogOpen, setTrustDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const {
    progress,
    completedSet,
    totalSubtopics,
    completedCount,
    overallPercent,
    nextRecommendedSubtopic,
    levelStats,
    isSubtopicUnlocked,
    isCourseUnlocked,
    getCourseStats,
    toggleSubtopicComplete,
    markSubtopicComplete,
    toggleDrillStep,
    saveReflection,
    saveGameDayCue,
    setStrictSequence,
    updateProfile,
    loadSampleJourney,
    resetProgress,
  } = useAthleteProgress();

  const activeSubtopic =
    SUBTOPIC_MAP[activeSubtopicId] ?? nextRecommendedSubtopic;

  const navigateTo = (view: Exclude<AppView, 'lesson'>) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSubtopic = (subtopicId: string) => {
    if (activeView !== 'lesson') {
      setReturnView(activeView);
    }
    setActiveSubtopicId(subtopicId);
    setActiveView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteAndNext = (nextId: string | null) => {
    markSubtopicComplete(activeSubtopic.id);
    if (nextId) {
      setActiveSubtopicId(nextId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveView('map');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems: Array<{
    id: Exclude<AppView, 'lesson'>;
    label: string;
    icon: typeof Home;
  }> = [
    { id: 'home', label: 'Today', icon: Home },
    { id: 'map', label: 'Mastery Map', icon: Layers },
    { id: 'courses', label: '10 Courses', icon: Compass },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  const trustLevel = LEVELS[0];

  return (
    <div className="hc-app">
      {/* Top Header */}
      <header className="hc-topbar">
        <div className="hc-topbar__inner">
          <button
            type="button"
            className="hc-brand-btn"
            onClick={() => navigateTo('home')}
            aria-label="Head Coach Home"
          >
            <img
              src={`${import.meta.env.BASE_URL}headcoach-logo.png`}
              alt="Head Coach"
              width={165}
              height={30}
              className="hc-brand-logo"
            />
          </button>

          <nav className="hc-desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent =
                activeView === item.id ||
                (activeView === 'lesson' && item.id === 'courses');
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`hc-nav-btn ${isCurrent ? 'is-active' : ''}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => navigateTo(item.id)}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hc-topbar__right">
            <button
              type="button"
              className="hc-progress-pill"
              onClick={() => navigateTo('journal')}
              aria-label={`Overall progress ${completedCount} of ${totalSubtopics} drills complete`}
            >
              <span className="hc-progress-pill__dot" aria-hidden="true" />
              <span>
                {completedCount}/{totalSubtopics}
              </span>
              <span className="hc-progress-pill__pct">{overallPercent}%</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="hc-main" id="main-content">
        {activeView === 'home' && (
          <HomeView
            athleteName={progress.athleteName}
            completedCount={completedCount}
            totalSubtopics={totalSubtopics}
            overallPercent={overallPercent}
            nextRecommended={nextRecommendedSubtopic}
            levelStats={levelStats}
            completedSet={completedSet}
            onOpenSubtopic={openSubtopic}
            onNavigate={(view) =>
              view === 'lesson'
                ? openSubtopic(nextRecommendedSubtopic.id)
                : navigateTo(view)
            }
            onOpenTrustBriefing={() => setTrustDialogOpen(true)}
            onLoadSampleJourney={loadSampleJourney}
          />
        )}

        {activeView === 'map' && (
          <MasteryMapView
            completedSet={completedSet}
            getCourseStats={getCourseStats}
            isSubtopicUnlocked={isSubtopicUnlocked}
            onOpenSubtopic={openSubtopic}
            onOpenTrustBriefing={() => setTrustDialogOpen(true)}
          />
        )}

        {activeView === 'courses' && (
          <CoursesView
            completedSet={completedSet}
            strictSequence={progress.strictSequence}
            onToggleStrictSequence={setStrictSequence}
            getCourseStats={getCourseStats}
            isSubtopicUnlocked={isSubtopicUnlocked}
            isCourseUnlocked={isCourseUnlocked}
            onOpenSubtopic={openSubtopic}
          />
        )}

        {activeView === 'lesson' && (
          <LessonStudio
            subtopic={activeSubtopic}
            isCompleted={completedSet.has(activeSubtopic.id)}
            checkedSteps={progress.checkedDrillSteps[activeSubtopic.id] ?? []}
            reflection={progress.reflections[activeSubtopic.id] ?? ''}
            gameDayCue={progress.gameDayCues[activeSubtopic.id] ?? ''}
            completedSet={completedSet}
            onBack={() => navigateTo(returnView)}
            onSelectSubtopic={openSubtopic}
            onToggleStep={(stepIdx) => toggleDrillStep(activeSubtopic.id, stepIdx)}
            onSaveReflection={(text) => saveReflection(activeSubtopic.id, text)}
            onSaveCue={(cue) => saveGameDayCue(activeSubtopic.id, cue)}
            onToggleComplete={() => toggleSubtopicComplete(activeSubtopic.id)}
            onCompleteAndNext={handleCompleteAndNext}
          />
        )}

        {activeView === 'journal' && (
          <JournalView
            progress={progress}
            completedCount={completedCount}
            totalSubtopics={totalSubtopics}
            levelStats={levelStats}
            onUpdateProfile={updateProfile}
            onOpenSubtopic={openSubtopic}
            onLoadSampleJourney={loadSampleJourney}
            onRequestReset={() => setResetDialogOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="hc-mobile-dock" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrent =
            activeView === item.id ||
            (activeView === 'lesson' && item.id === 'courses');
          return (
            <button
              key={item.id}
              type="button"
              className={`hc-dock-btn ${isCurrent ? 'is-active' : ''}`}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => navigateTo(item.id)}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Native <dialog> — TRUST Bedrock Briefing */}
      <NativeDialog
        open={trustDialogOpen}
        onClose={() => setTrustDialogOpen(false)}
        eyebrow={trustLevel.stageTag}
        title={trustLevel.narrativeTitle}
        accent={trustLevel.accent}
      >
        <div className="hc-trust-modal">
          <p className="hc-trust-modal__lead">{trustLevel.narrativeDesc}</p>
          <div className="hc-trust-pillars">
            <div className="hc-trust-pillar">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <strong>1. Trust in Coach</strong>
                <p>
                  Honest feedback is received as objective performance telemetry,
                  never as personal criticism.
                </p>
              </div>
            </div>
            <div className="hc-trust-pillar">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <strong>2. Trust in Process</strong>
                <p>
                  The 4 levels compound in order: YOU (Foundations) → ME
                  (Systems) → US (Inner Mind) → YOU (Flow).
                </p>
              </div>
            </div>
            <div className="hc-trust-pillar">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <strong>3. Trust in Self</strong>
                <p>
                  Earned through volume of reps so that under finals pressure,
                  instinct takes over cleanly.
                </p>
              </div>
            </div>
          </div>
          <div className="hc-dialog-actions">
            <button
              type="button"
              className="hc-btn hc-btn--volt"
              autoFocus
              onClick={() => {
                setTrustDialogOpen(false);
                openSubtopic(nextRecommendedSubtopic.id);
              }}
            >
              Start / Continue Training
            </button>
            <button
              type="button"
              className="hc-btn hc-btn--ghost"
              onClick={() => setTrustDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </NativeDialog>

      {/* Native <dialog> — Confirm Reset Progress */}
      <NativeDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        eyebrow="ATHLETE DATA"
        title="Reset all saved training progress?"
        accent="#F43F5E"
        closedBy="closerequest"
      >
        <p className="hc-dialog-copy">
          This clears all completed drills, checked steps, game-day cues, and
          field journal notes stored on this device.
        </p>
        <div className="hc-dialog-actions">
          <button
            type="button"
            className="hc-btn hc-btn--danger"
            onClick={() => {
              resetProgress();
              setResetDialogOpen(false);
            }}
          >
            Reset Progress
          </button>
          <button
            type="button"
            className="hc-btn hc-btn--outline"
            autoFocus
            onClick={() => setResetDialogOpen(false)}
          >
            Keep My Data
          </button>
        </div>
      </NativeDialog>
    </div>
  );
}
