import { useCallback, useEffect, useMemo, useState } from 'react';
import { ALL_SUBTOPICS, COURSES, LEVEL_ORDER } from '../data/curriculum';
import type { AthleteProgress, Course, Subtopic } from '../types/curriculum';

const STORAGE_KEY = 'headcoach_athlete_progress_v1';

const DEFAULT_PROGRESS: AthleteProgress = {
  athleteName: 'Junior Athlete',
  sport: 'Elite Development',
  completedSubtopics: [],
  completedChallenges: [],
  checkedDrillSteps: {},
  reflections: {},
  gameDayCues: {},
  lastSubtopicId: null,
  strictSequence: false,
  sessionsCompleted: 0,
};

const SAMPLE_PROGRESS: AthleteProgress = {
  athleteName: 'Sam',
  sport: 'State Representative Tennis & Football',
  completedSubtopics: [
    'intro-strengths',
    'intro-coaching',
    'intro-primitives',
    'found-hunger',
    'found-growth',
    'found-inputs',
    'motiv-first',
  ],
  completedChallenges: [
    'intro-strengths',
    'intro-coaching',
    'intro-primitives',
    'found-hunger',
    'found-growth',
  ],
  checkedDrillSteps: {
    'intro-strengths': [0, 1, 2],
    'intro-coaching': [0, 1, 2],
    'intro-primitives': [0, 1, 2],
    'found-hunger': [0, 1, 2],
    'found-growth': [0, 1, 2],
    'found-inputs': [0, 1, 2],
    'motiv-first': [0, 1, 2],
    'motiv-compete-self': [0],
  },
  reflections: {
    'intro-strengths':
      'First-step speed, court vision under fatigue, and staying calm on big points when I slow my breathing.',
    'found-inputs':
      'My 3 inputs: split-step intensity, tall body language after errors, and a slow exhale before every serve.',
    'motiv-first':
      'When I feel flat before a 6:30am session, I put my shoes on and do 90 seconds of jump rope — energy always follows.',
    'staying-stay-game':
      'When I drop two games in a row I start rushing. Next time: stand tall, walk slow to the towel, play the next 3 points only.',
  },
  gameDayCues: {
    'intro-strengths': 'Relentless pace & calm reads',
    'intro-primitives': 'Tall · Breath · Eyes locked',
    'found-inputs': 'Win the input, let the score follow',
    'motiv-first': 'Move first, mood follows',
    'staying-stay-game': 'Still here · Next 3 plays',
    'selftalk-active': 'Drive through target',
  },
  lastSubtopicId: 'motiv-compete-self',
  strictSequence: false,
  sessionsCompleted: 7,
};

function loadInitialProgress(): AthleteProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<AthleteProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedSubtopics: Array.isArray(parsed.completedSubtopics)
        ? parsed.completedSubtopics
        : [],
      completedChallenges: Array.isArray(parsed.completedChallenges)
        ? parsed.completedChallenges
        : [],
      checkedDrillSteps: parsed.checkedDrillSteps ?? {},
      reflections: parsed.reflections ?? {},
      gameDayCues: parsed.gameDayCues ?? {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useAthleteProgress() {
  const [progress, setProgress] = useState<AthleteProgress>(loadInitialProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [progress]);

  const completedSet = useMemo(
    () => new Set(progress.completedSubtopics),
    [progress.completedSubtopics],
  );

  const completedChallengesSet = useMemo(
    () => new Set(progress.completedChallenges),
    [progress.completedChallenges],
  );

  const xp = useMemo(() => {
    const drillXp = progress.completedSubtopics.length * 50;
    const challengeXp = progress.completedChallenges.length * 20;
    const stepXp =
      Object.values(progress.checkedDrillSteps).reduce(
        (acc, steps) => acc + steps.length,
        0,
      ) * 5;
    const cueXp = Object.values(progress.gameDayCues).filter((v) =>
      v.trim(),
    ).length * 10;
    const noteXp = Object.values(progress.reflections).filter((v) =>
      v.trim(),
    ).length * 10;
    return drillXp + challengeXp + stepXp + cueXp + noteXp;
  }, [progress]);

  const rankInfo = useMemo(() => {
    const ranks = [
      { title: 'ROOKIE', minXp: 0 },
      { title: 'CHALLENGER', minXp: 150 },
      { title: 'STARTER', minXp: 400 },
      { title: 'CAPTAIN', minXp: 800 },
      { title: 'ALL-STAR', minXp: 1300 },
      { title: 'APEX', minXp: 1900 },
    ];
    let current = ranks[0];
    let next: (typeof ranks)[number] | null = ranks[1];
    for (let i = 0; i < ranks.length; i++) {
      if (xp >= ranks[i].minXp) {
        current = ranks[i];
        next = ranks[i + 1] ?? null;
      }
    }
    const levelProgress = next
      ? Math.min(
          100,
          Math.round(
            ((xp - current.minXp) / (next.minXp - current.minXp)) * 100,
          ),
        )
      : 100;
    return {
      title: current.title,
      xp,
      nextTitle: next?.title ?? null,
      nextMinXp: next?.minXp ?? null,
      levelProgress,
    };
  }, [xp]);

  const totalSubtopics = ALL_SUBTOPICS.length;
  const completedCount = progress.completedSubtopics.length;
  const overallPercent = Math.round((completedCount / totalSubtopics) * 100);

  const nextRecommendedSubtopic: Subtopic = useMemo(() => {
    const firstIncomplete = ALL_SUBTOPICS.find((s) => !completedSet.has(s.id));
    return firstIncomplete ?? ALL_SUBTOPICS[ALL_SUBTOPICS.length - 1];
  }, [completedSet]);

  const isSubtopicUnlocked = useCallback(
    (subtopic: Subtopic): boolean => {
      if (!progress.strictSequence) return true;
      if (subtopic.globalOrder === 1) return true;
      if (completedSet.has(subtopic.id)) return true;
      const prev = ALL_SUBTOPICS[subtopic.globalOrder - 2];
      return prev ? completedSet.has(prev.id) : true;
    },
    [completedSet, progress.strictSequence],
  );

  const isCourseUnlocked = useCallback(
    (course: Course): boolean => {
      if (!progress.strictSequence) return true;
      if (course.order === 1) return true;
      const firstSub = course.subtopics[0];
      return firstSub ? isSubtopicUnlocked(firstSub) : true;
    },
    [isSubtopicUnlocked, progress.strictSequence],
  );

  const getCourseStats = useCallback(
    (course: Course) => {
      const done = course.subtopics.filter((s) => completedSet.has(s.id)).length;
      const total = course.subtopics.length;
      return {
        done,
        total,
        percent: Math.round((done / total) * 100),
        isComplete: done === total,
      };
    },
    [completedSet],
  );

  const levelStats = useMemo(() => {
    return LEVEL_ORDER.map((tier) => {
      const tierCourses = COURSES.filter((c) => c.tier === tier);
      const tierSubs = tierCourses.flatMap((c) => c.subtopics);
      const done = tierSubs.filter((s) => completedSet.has(s.id)).length;
      return {
        tier,
        coursesCount: tierCourses.length,
        total: tierSubs.length,
        done,
        percent: Math.round((done / tierSubs.length) * 100),
        isComplete: done === tierSubs.length,
      };
    });
  }, [completedSet]);

  const toggleSubtopicComplete = useCallback((subtopicId: string) => {
    setProgress((prev) => {
      const exists = prev.completedSubtopics.includes(subtopicId);
      const completedSubtopics = exists
        ? prev.completedSubtopics.filter((id) => id !== subtopicId)
        : [...prev.completedSubtopics, subtopicId];
      return {
        ...prev,
        completedSubtopics,
        lastSubtopicId: subtopicId,
        sessionsCompleted: exists
          ? prev.sessionsCompleted
          : prev.sessionsCompleted + 1,
      };
    });
  }, []);

  const markSubtopicComplete = useCallback((subtopicId: string) => {
    setProgress((prev) => {
      if (prev.completedSubtopics.includes(subtopicId)) {
        return { ...prev, lastSubtopicId: subtopicId };
      }
      return {
        ...prev,
        completedSubtopics: [...prev.completedSubtopics, subtopicId],
        lastSubtopicId: subtopicId,
        sessionsCompleted: prev.sessionsCompleted + 1,
      };
    });
  }, []);

  const toggleDrillStep = useCallback((subtopicId: string, stepIndex: number) => {
    setProgress((prev) => {
      const existing = prev.checkedDrillSteps[subtopicId] ?? [];
      const next = existing.includes(stepIndex)
        ? existing.filter((i) => i !== stepIndex)
        : [...existing, stepIndex].sort((a, b) => a - b);
      return {
        ...prev,
        checkedDrillSteps: {
          ...prev.checkedDrillSteps,
          [subtopicId]: next,
        },
      };
    });
  }, []);

  const saveReflection = useCallback((subtopicId: string, text: string) => {
    setProgress((prev) => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [subtopicId]: text,
      },
    }));
  }, []);

  const saveGameDayCue = useCallback((subtopicId: string, cue: string) => {
    setProgress((prev) => ({
      ...prev,
      gameDayCues: {
        ...prev.gameDayCues,
        [subtopicId]: cue,
      },
    }));
  }, []);

  const setStrictSequence = useCallback((strict: boolean) => {
    setProgress((prev) => ({ ...prev, strictSequence: strict }));
  }, []);

  const updateProfile = useCallback((athleteName: string, sport: string) => {
    setProgress((prev) => ({ ...prev, athleteName, sport }));
  }, []);

  const loadSampleJourney = useCallback(() => {
    setProgress(SAMPLE_PROGRESS);
  }, []);

  const recordChallengeWin = useCallback((subtopicId: string) => {
    setProgress((prev) => {
      if (prev.completedChallenges.includes(subtopicId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, subtopicId],
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    completedSet,
    completedChallengesSet,
    xp,
    rankInfo,
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
    recordChallengeWin,
    loadSampleJourney,
    resetProgress,
  };
}
