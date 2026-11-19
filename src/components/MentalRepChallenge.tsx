import { useState } from 'react';
import { CheckCircle2, Flame, RotateCcw, XCircle, Zap } from 'lucide-react';
import { MENTAL_CHALLENGES } from '../data/challenges';
import { playChallengeMiss, playChallengeWin, playTap } from '../utils/soundFx';

interface MentalRepChallengeProps {
  subtopicId: string;
  isSolved: boolean;
  onWin: () => void;
}

export function MentalRepChallenge({
  subtopicId,
  isSolved,
  onWin,
}: MentalRepChallengeProps) {
  const challenge = MENTAL_CHALLENGES[subtopicId];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  if (!challenge) return null;

  const isCorrect = selectedIdx === challenge.correctIndex;
  const hasAnswered = selectedIdx !== null;

  const handleSelect = (idx: number) => {
    if (isCorrect) return;
    setSelectedIdx(idx);
    setAttempts((a) => a + 1);

    if (idx === challenge.correctIndex) {
      playChallengeWin();
      onWin();
    } else {
      playChallengeMiss();
    }
  };

  const handleRetry = () => {
    playTap();
    setSelectedIdx(null);
  };

  return (
    <section
      className={`hc-card-block hc-challenge ${
        isCorrect || isSolved ? 'is-solved' : ''
      }`}
      aria-labelledby="challenge-heading"
    >
      <div className="hc-challenge__head">
        <div>
          <span className="hc-mono-tag" style={{ color: '#DFFF00' }}>
            COACH&apos;S QUICK REP · GAME SITUATION
          </span>
          <h2 id="challenge-heading" className="hc-card-block__title">
            WHAT&apos;S YOUR CALL?
          </h2>
        </div>
        <span
          className={`hc-xp-chip ${isCorrect || isSolved ? 'is-earned' : ''}`}
        >
          <Zap size={12} aria-hidden="true" />
          <span>{isCorrect || isSolved ? 'LOCKED +20 XP' : '+20 XP'}</span>
        </span>
      </div>

      <div className="hc-challenge__scenario">
        <span className="hc-challenge__badge">
          <Flame size={13} aria-hidden="true" /> SCENARIO
        </span>
        <p>{challenge.situation}</p>
      </div>

      <p className="hc-challenge__question">{challenge.question}</p>

      <div className="hc-challenge__options" role="radiogroup" aria-label={challenge.question}>
        {challenge.options.map((opt, idx) => {
          const picked = selectedIdx === idx;
          const isWinner = idx === challenge.correctIndex;
          const showRight = hasAnswered && isCorrect && isWinner;
          const showWrong = picked && !isWinner;

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={picked}
              className={`hc-challenge__opt ${showRight ? 'is-correct' : ''} ${
                showWrong ? 'is-wrong' : ''
              }`}
              onClick={() => handleSelect(idx)}
              disabled={isCorrect}
            >
              <span className="hc-challenge__opt-key">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="hc-challenge__opt-text">{opt}</span>
              {showRight && (
                <CheckCircle2
                  size={17}
                  className="hc-challenge__opt-icon"
                  aria-hidden="true"
                />
              )}
              {showWrong && (
                <XCircle
                  size={17}
                  className="hc-challenge__opt-icon"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div
          className={`hc-challenge__feedback ${
            isCorrect ? 'is-correct' : 'is-wrong'
          }`}
          aria-live="polite"
        >
          {isCorrect ? (
            <>
              <strong>
                ELITE CALL{attempts === 1 ? ' · FIRST-TRY LOCK!' : '!'}
              </strong>
              <p>{challenge.coachTakeaway}</p>
            </>
          ) : (
            <div className="hc-challenge__retry-row">
              <div>
                <strong>NOT QUITE — RE-READ THE CUE</strong>
                <p>
                  Think about what keeps you composed and in control of the next
                  rep.
                </p>
              </div>
              <button
                type="button"
                className="hc-btn hc-btn--outline"
                onClick={handleRetry}
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Try Again</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
