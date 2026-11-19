import { useEffect, useState } from 'react';
import { Play, RotateCcw, Square } from 'lucide-react';
import type { PacerConfig } from '../types/curriculum';
import { playDrillComplete, playPhaseCue, playTap } from '../utils/soundFx';

interface BreathingPacerProps {
  config: PacerConfig;
  accent: string;
}

export function BreathingPacer({ config, accent }: BreathingPacerProps) {
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(config.phases[0].seconds);
  const [completed, setCompleted] = useState(false);

  const currentPhase = config.phases[phaseIdx];

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        const nextPhase = phaseIdx + 1;
        if (nextPhase < config.phases.length) {
          setPhaseIdx(nextPhase);
          playPhaseCue(config.phases[nextPhase].name);
          return config.phases[nextPhase].seconds;
        }
        if (cycle < config.cycles) {
          setCycle((c) => c + 1);
          setPhaseIdx(0);
          playPhaseCue(config.phases[0].name);
          return config.phases[0].seconds;
        }
        setRunning(false);
        setCompleted(true);
        playDrillComplete();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, phaseIdx, cycle, config]);

  const handleReset = () => {
    playTap();
    setRunning(false);
    setCycle(1);
    setPhaseIdx(0);
    setSecondsLeft(config.phases[0].seconds);
    setCompleted(false);
  };

  const handleToggle = () => {
    if (completed) {
      setCycle(1);
      setPhaseIdx(0);
      setSecondsLeft(config.phases[0].seconds);
      setCompleted(false);
      setRunning(true);
      playPhaseCue(config.phases[0].name);
    } else {
      const nextRunning = !running;
      setRunning(nextRunning);
      if (nextRunning) {
        playPhaseCue(currentPhase.name);
      } else {
        playTap();
      }
    }
  };

  const progressRatio =
    currentPhase && currentPhase.seconds > 0
      ? ((currentPhase.seconds - secondsLeft) / currentPhase.seconds) * 100
      : 100;

  const phaseLower = currentPhase.name.toLowerCase();
  const orbMode = completed
    ? 'is-done'
    : !running
    ? 'is-idle'
    : phaseLower.includes('inhale')
    ? 'is-inhale'
    : phaseLower.includes('exhale')
    ? 'is-exhale'
    : 'is-hold';

  return (
    <div
      className="hc-pacer"
      style={{ ['--pacer-accent' as string]: accent }}
      aria-live="polite"
    >
      <div className="hc-pacer__header">
        <div>
          <span className="hc-mono-tag">LIVE PROTOCOL PACER</span>
          <h4 className="hc-pacer__title">{config.label}</h4>
          <p className="hc-pacer__sub">{config.subtitle}</p>
        </div>
        <div className="hc-pacer__cycle">
          ROUND {cycle}/{config.cycles}
        </div>
      </div>

      <div className="hc-pacer__stage hc-pacer__stage--orb">
        <div
          className={`hc-pacer__orb ${orbMode}`}
          style={{
            ['--phase-duration' as string]: `${Math.max(1, currentPhase.seconds)}s`,
          }}
          aria-hidden="true"
        >
          <div className="hc-pacer__orb-ring" />
          <div className="hc-pacer__orb-core">
            <span className="hc-pacer__seconds">
              {completed ? '✓' : `${secondsLeft}s`}
            </span>
          </div>
        </div>

        <div className="hc-pacer__readout">
          <div className="hc-pacer__counter">
            <span className="hc-pacer__phase">
              {completed ? 'LOCKED IN' : currentPhase.name}
            </span>
          </div>
          <p className="hc-pacer__instruction">
            {completed
              ? 'Protocol complete. Step back into play sharp and composed.'
              : currentPhase.instruction}
          </p>
          <div className="hc-pacer__bar" aria-hidden="true">
            <div
              className="hc-pacer__bar-fill"
              style={{ width: `${completed ? 100 : Math.max(8, progressRatio)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="hc-pacer__phases">
        {config.phases.map((p, idx) => (
          <div
            key={`${p.name}-${idx}`}
            className={`hc-pacer__chip ${
              !completed && idx === phaseIdx ? 'is-active' : ''
            }`}
          >
            <span>{p.name}</span>
            <strong>{p.seconds}s</strong>
          </div>
        ))}
      </div>

      <div className="hc-pacer__actions">
        <button
          type="button"
          className="hc-btn hc-btn--volt"
          onClick={handleToggle}
        >
          {running ? (
            <Square size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
          <span>
            {running
              ? 'Pause Pacer'
              : completed
              ? 'Run Again'
              : 'Start Protocol'}
          </span>
        </button>
        <button
          type="button"
          className="hc-btn hc-btn--ghost"
          onClick={handleReset}
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
