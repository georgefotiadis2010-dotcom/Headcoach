export type TierId = 0 | 1 | 2 | 3 | 4;

export type DrillFormat =
  | 'Mindset Lab'
  | 'On-Court Drill'
  | 'Systems Builder'
  | 'Breathing Protocol'
  | 'Visualisation Rep'
  | 'Peak Calibration';

export type BlueprintKind =
  | 'strengths-matrix'
  | 'coaching-loop'
  | 'primitives-stack'
  | 'intrinsic-engine'
  | 'growth-curve'
  | 'inputs-outcomes'
  | 'action-flywheel'
  | 'self-benchmark'
  | 'sovereignty-ring'
  | 'play-like-train'
  | 'failure-telemetry'
  | 'forged-resilience'
  | 'smart-target'
  | 'systems-pipeline'
  | 'stay-in-game'
  | 'focus-tunnel'
  | 'evidence-bank'
  | 'present-anchor'
  | 'inner-arena'
  | 'reframe-circuit'
  | 'active-cue'
  | 'pregame-map'
  | 'ingame-snapshot'
  | 'somatic-downshift'
  | 'arousal-curve'
  | 'apex-flow';

export interface PacerConfig {
  label: string;
  subtitle: string;
  cycles: number;
  phases: {
    name: string;
    seconds: number;
    instruction: string;
  }[];
}

export interface Subtopic {
  id: string;
  courseId: string;
  tier: Exclude<TierId, 0>;
  indexInCourse: number;
  globalOrder: number;
  title: string;
  shortTitle: string;
  tag: string;
  color: string;
  durationMin: number;
  format: DrillFormat;
  summary: string;
  desc: string;
  bullets: string[];
  drillTitle: string;
  drillSteps: string[];
  reflectionPrompt: string;
  cuePrompt: string;
  cuePlaceholder: string;
  blueprintKind: BlueprintKind;
  blueprintLabel: string;
  videoPreviewDuration: string;
  pacer?: PacerConfig;
  isGameDayReset?: boolean;
}

export interface Course {
  id: string;
  number: string; // '01' .. '10'
  order: number; // 1 .. 10
  tier: Exclude<TierId, 0>;
  title: string;
  subtitle: string;
  featured?: boolean;
  featuredLabel?: string;
  connectsFrom: string | null;
  leadsTo: string | null;
  connectionNote: string;
  subtopics: Subtopic[];
}

export interface LevelInfo {
  tier: TierId;
  code: string;
  name: string;
  shortName: string;
  ownershipBadge: 'TRUST' | 'YOU' | 'ME' | 'US';
  ownershipRole: 'BEDROCK' | 'ATHLETE' | 'COACH' | 'TOGETHER';
  ownershipDetail: string;
  stageTag: string;
  narrativeTitle: string;
  narrativeDesc: string;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  accentText: string;
}

export type AppView = 'home' | 'map' | 'courses' | 'lesson' | 'journal';

export interface AthleteProgress {
  athleteName: string;
  sport: string;
  completedSubtopics: string[];
  checkedDrillSteps: Record<string, number[]>;
  reflections: Record<string, string>;
  gameDayCues: Record<string, string>;
  lastSubtopicId: string | null;
  strictSequence: boolean;
  sessionsCompleted: number;
}
