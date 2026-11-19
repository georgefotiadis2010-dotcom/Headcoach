import { useState } from 'react';
import type { BlueprintKind } from '../types/curriculum';
import { playTap } from '../utils/soundFx';

interface DrillBlueprintProps {
  kind: BlueprintKind;
  color: string;
  label: string;
  courseNumber: string;
  cues?: string[];
}

/**
 * Bespoke dark-surface tactical coaching-board SVG diagram for each subtopic.
 */
export function DrillBlueprint({
  kind,
  color,
  label,
  courseNumber,
  cues = [],
}: DrillBlueprintProps) {
  const [activeCueIdx, setActiveCueIdx] = useState(0);
  const volt = '#DFFF00';
  const chalk = '#F4F4EE';
  const muted = 'rgba(244, 244, 238, 0.25)';

  return (
    <div className="hc-blueprint" style={{ ['--bp-accent' as string]: color }}>
      <div className="hc-blueprint__meta">
        <span>COURSE {courseNumber} · TACTICAL BLUEPRINT</span>
        <span style={{ color }}>{label}</span>
      </div>

      <svg
        className="hc-blueprint__svg"
        viewBox="0 0 640 300"
        role="img"
        aria-label={label}
      >
        {/* Tactical grid backdrop */}
        <defs>
          <pattern id={`grid-${kind}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="rgba(244,244,238,0.06)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="640" height="300" fill="#0B0C09" />
        <rect width="640" height="300" fill={`url(#grid-${kind})`} />

        {/* Corner court ticks */}
        <path d="M16 32 V16 H32 M608 16 H624 V32 M16 268 V284 H32 M608 284 H624 V268" stroke={muted} strokeWidth="1.5" fill="none" />

        {/* Live tactical radar pulse */}
        <circle
          cx="320"
          cy="150"
          r="118"
          fill="none"
          stroke={color}
          strokeOpacity="0.16"
          strokeWidth="1"
          className="hc-bp-pulse"
        />

        {renderDiagram(kind, color, volt, chalk, muted)}
      </svg>

      {cues.length > 0 && (
        <div className="hc-blueprint__interactive">
          <div className="hc-blueprint__tabs" role="tablist" aria-label="Tactical blueprint cues">
            {cues.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeCueIdx === idx}
                className={`hc-blueprint__tab ${
                  activeCueIdx === idx ? 'is-active' : ''
                }`}
                onClick={() => {
                  playTap();
                  setActiveCueIdx(idx);
                }}
              >
                CUE 0{idx + 1}
              </button>
            ))}
          </div>
          <p className="hc-blueprint__cue-copy" aria-live="polite">
            <span className="hc-blueprint__cue-num">0{activeCueIdx + 1}</span>
            <span>{cues[activeCueIdx] ?? cues[0]}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function renderDiagram(
  kind: BlueprintKind,
  accent: string,
  volt: string,
  chalk: string,
  muted: string,
) {
  switch (kind) {
    case 'strengths-matrix':
      return (
        <g>
          {/* Radar diamond */}
          <polygon points="320,38 450,150 320,262 190,150" fill="none" stroke={muted} strokeWidth="1.2" />
          <polygon points="320,78 404,150 320,222 236,150" fill="none" stroke={muted} strokeWidth="1" strokeDasharray="4 4" />
          <line x1="320" y1="38" x2="320" y2="262" stroke={muted} strokeWidth="1" />
          <line x1="190" y1="150" x2="450" y2="150" stroke={muted} strokeWidth="1" />
          {/* Leverage polygon */}
          <polygon
            points="320,52 432,150 320,214 248,150"
            fill={accent}
            fillOpacity="0.18"
            stroke={volt}
            strokeWidth="2.5"
          />
          <circle cx="320" cy="52" r="6" fill={volt} />
          <circle cx="432" cy="150" r="6" fill={volt} />
          <circle cx="320" cy="214" r="5" fill={accent} />
          <circle cx="248" cy="150" r="5" fill={accent} />
          <text x="320" y="28" textAnchor="middle" fill={volt} fontSize="11" fontFamily="JetBrains Mono, monospace">SPEED / PACE</text>
          <text x="466" y="154" textAnchor="start" fill={volt} fontSize="11" fontFamily="JetBrains Mono, monospace">VISION</text>
          <text x="320" y="282" textAnchor="middle" fill={chalk} fontSize="11" fontFamily="JetBrains Mono, monospace">POISE</text>
          <text x="174" y="154" textAnchor="end" fill={chalk} fontSize="11" fontFamily="JetBrains Mono, monospace">GRIT</text>
        </g>
      );

    case 'coaching-loop':
    case 'action-flywheel':
    case 'reframe-circuit':
      return (
        <g>
          <circle cx="320" cy="150" r="92" fill="none" stroke={muted} strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M 320 58 A 92 92 0 0 1 412 150" fill="none" stroke={volt} strokeWidth="3.5" />
          <path d="M 412 150 A 92 92 0 0 1 320 242" fill="none" stroke={accent} strokeWidth="3.5" />
          <path d="M 320 242 A 92 92 0 0 1 228 150" fill="none" stroke={chalk} strokeWidth="2.5" opacity="0.7" />
          <path d="M 228 150 A 92 92 0 0 1 320 58" fill="none" stroke={accent} strokeWidth="2.5" />
          <rect x="255" y="130" width="130" height="40" fill="#1B1D17" stroke={volt} strokeWidth="1.5" />
          <text x="320" y="154" textAnchor="middle" fill={volt} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {kind === 'coaching-loop'
              ? 'REP → DATA → FIX'
              : kind === 'action-flywheel'
              ? 'ACTION → FUEL'
              : 'SPOT → REFRAME'}
          </text>
          <text x="320" y="42" textAnchor="middle" fill={chalk} fontSize="11" fontFamily="JetBrains Mono, monospace">01 · TRIGGER</text>
          <text x="488" y="154" textAnchor="middle" fill={accent} fontSize="11" fontFamily="JetBrains Mono, monospace">02 · EXECUTE</text>
          <text x="320" y="268" textAnchor="middle" fill={chalk} fontSize="11" fontFamily="JetBrains Mono, monospace">03 · CALIBRATE</text>
          <text x="150" y="154" textAnchor="middle" fill={chalk} fontSize="11" fontFamily="JetBrains Mono, monospace">04 · LOCK IN</text>
        </g>
      );

    case 'primitives-stack':
    case 'systems-pipeline':
      return (
        <g>
          {[
            { y: 210, w: 420, label: '01 · POSTURE & BREATH BASE', stroke: accent, fill: 'rgba(16,185,129,0.12)' },
            { y: 152, w: 340, label: '02 · VISUAL LOCK & FIRST STEP', stroke: accent, fill: 'rgba(16,185,129,0.08)' },
            { y: 94, w: 260, label: '03 · PRESSURE EXECUTION', stroke: volt, fill: 'rgba(223,255,0,0.10)' },
          ].map((row, idx) => (
            <g key={idx}>
              <rect
                x={320 - row.w / 2}
                y={row.y}
                width={row.w}
                height="44"
                fill={row.fill}
                stroke={row.stroke}
                strokeWidth="1.8"
              />
              <text
                x="320"
                y={row.y + 26}
                textAnchor="middle"
                fill={idx === 2 ? volt : chalk}
                fontSize="12"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {kind === 'systems-pipeline'
                  ? idx === 0
                    ? 'T-60 MIN · PREP & FUEL'
                    : idx === 1
                    ? 'T-15 MIN · PHYSICAL + MENTAL RUN'
                    : 'T-00 · AUTOPILOT EXECUTION'
                  : row.label}
              </text>
            </g>
          ))}
          <text x="320" y="64" textAnchor="middle" fill={muted} fontSize="11" fontFamily="JetBrains Mono, monospace">
            BUILT FROM THE BEDROCK UP
          </text>
        </g>
      );

    case 'inputs-outcomes':
    case 'inner-arena':
      return (
        <g>
          <rect x="64" y="64" width="224" height="172" fill={accent} fillOpacity="0.12" stroke={volt} strokeWidth="2" />
          <rect x="352" y="64" width="224" height="172" fill="rgba(244,244,238,0.03)" stroke={muted} strokeWidth="1.2" strokeDasharray="5 5" />
          <text x="176" y="98" textAnchor="middle" fill={volt} fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {kind === 'inputs-outcomes' ? '100% CONTROLLABLE' : 'TRAINED TEAMMATE'}
          </text>
          <text x="176" y="136" textAnchor="middle" fill={chalk} fontSize="12" fontFamily="Inter, sans-serif">
            {kind === 'inputs-outcomes' ? 'Effort · Posture · Reset' : 'Calm · Direct · Forward'}
          </text>
          <text x="176" y="164" textAnchor="middle" fill={chalk} fontSize="12" fontFamily="Inter, sans-serif">
            {kind === 'inputs-outcomes' ? 'Preparation · Next Play' : 'Trusts Reps · Clear Cue'}
          </text>
          <rect x="116" y="192" width="120" height="26" fill={volt} />
          <text x="176" y="209" textAnchor="middle" fill="#000" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            DOMINATE HERE
          </text>

          <text x="464" y="98" textAnchor="middle" fill={muted} fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {kind === 'inputs-outcomes' ? 'NOISE / OUTCOMES' : 'INNER CRITIC'}
          </text>
          <text x="464" y="138" textAnchor="middle" fill="rgba(244,244,238,0.5)" fontSize="12" fontFamily="Inter, sans-serif">
            {kind === 'inputs-outcomes' ? 'Umpire · Weather · Crowd' : 'Doubt · Hesitation · Fear'}
          </text>
          <text x="464" y="166" textAnchor="middle" fill="rgba(244,244,238,0.5)" fontSize="12" fontFamily="Inter, sans-serif">
            {kind === 'inputs-outcomes' ? 'Scoreboard Pressure' : 'Obsessing Over Errors'}
          </text>
          <line x1="300" y1="150" x2="340" y2="150" stroke={accent} strokeWidth="2" />
        </g>
      );

    case 'stay-in-game':
    case 'growth-curve':
    case 'self-benchmark':
    case 'forged-resilience':
      return (
        <g>
          {/* Axes */}
          <line x1="76" y1="242" x2="576" y2="242" stroke={muted} strokeWidth="1.5" />
          <line x1="76" y1="48" x2="76" y2="242" stroke={muted} strokeWidth="1.5" />
          {/* Average athlete dropoff line */}
          <path
            d="M 80 120 Q 240 125 360 170 T 564 226"
            fill="none"
            stroke="rgba(244,244,238,0.3)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          {/* Elite Head Coach athlete line */}
          <path
            d={
              kind === 'forged-resilience'
                ? 'M 80 180 L 210 150 L 270 205 L 360 120 L 470 92 L 564 68'
                : 'M 80 155 Q 220 132 340 108 T 564 68'
            }
            fill="none"
            stroke={volt}
            strokeWidth="3.5"
          />
          <circle cx="564" cy="68" r="6" fill={volt} />
          <line x1="440" y1="54" x2="440" y2="242" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="448" y="226" fill={accent} fontSize="11" fontFamily="JetBrains Mono, monospace">
            {kind === 'stay-in-game' ? 'FINAL 10% ZONE' : 'BREAKTHROUGH'}
          </text>
          <text x="456" y="64" fill={volt} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            ENGAGED ATHLETE
          </text>
          <text x="456" y="210" fill="rgba(244,244,238,0.45)" fontSize="10" fontFamily="JetBrains Mono, monospace">
            MENTAL DRIFT
          </text>
          <text x="320" y="270" textAnchor="middle" fill={muted} fontSize="11" fontFamily="JetBrains Mono, monospace">
            TIME / FATIGUE / MATCH PRESSURE →
          </text>
        </g>
      );

    case 'focus-tunnel':
    case 'smart-target':
    case 'ingame-snapshot':
    case 'present-anchor':
      return (
        <g>
          <circle cx="320" cy="150" r="108" fill="none" stroke="rgba(244,244,238,0.14)" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="320" cy="150" r="72" fill={accent} fillOpacity="0.08" stroke={accent} strokeWidth="2" />
          <circle cx="320" cy="150" r="34" fill={volt} fillOpacity="0.16" stroke={volt} strokeWidth="2.5" />
          <circle cx="320" cy="150" r="6" fill={volt} />
          <line x1="176" y1="150" x2="274" y2="150" stroke={volt} strokeWidth="1.5" />
          <line x1="366" y1="150" x2="464" y2="150" stroke={volt} strokeWidth="1.5" />
          <line x1="320" y1="24" x2="320" y2="104" stroke={volt} strokeWidth="1.5" />
          <line x1="320" y1="196" x2="320" y2="276" stroke={volt} strokeWidth="1.5" />
          <text x="458" y="76" fill="rgba(244,244,238,0.42)" fontSize="11" fontFamily="JetBrains Mono, monospace">CROWD / NOISE</text>
          <text x="458" y="138" fill={volt} fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {kind === 'smart-target' ? 'EXACT TARGET' : 'EXECUTION CUE'}
          </text>
        </g>
      );

    case 'somatic-downshift':
    case 'arousal-curve':
      return (
        <g>
          <line x1="76" y1="240" x2="564" y2="240" stroke={muted} strokeWidth="1.5" />
          <line x1="76" y1="54" x2="76" y2="240" stroke={muted} strokeWidth="1.5" />
          {/* Inverted-U optimal arousal curve */}
          <path
            d="M 96 232 Q 320 -16 544 232"
            fill="none"
            stroke={accent}
            strokeWidth="3.5"
          />
          {/* Optimal zone band */}
          <rect x="256" y="74" width="128" height="166" fill={volt} fillOpacity="0.12" stroke={volt} strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="320" cy="108" r="7" fill={volt} />
          <text x="320" y="64" textAnchor="middle" fill={volt} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            PEAK ACTIVATION ZONE
          </text>
          <text x="148" y="264" textAnchor="middle" fill={muted} fontSize="10" fontFamily="JetBrains Mono, monospace">UNDER-AMPED (FLAT)</text>
          <text x="320" y="264" textAnchor="middle" fill={volt} fontSize="10" fontFamily="JetBrains Mono, monospace">CALIBRATED</text>
          <text x="492" y="264" textAnchor="middle" fill={muted} fontSize="10" fontFamily="JetBrains Mono, monospace">OVER-AMPED (PANIC)</text>
        </g>
      );

    case 'apex-flow':
      return (
        <g>
          {/* 4-tier pyramid converging to apex */}
          <polygon points="320,44 480,248 160,248" fill="none" stroke={muted} strokeWidth="1.5" />
          <line x1="200" y1="198" x2="440" y2="198" stroke="#10B981" strokeWidth="2.5" />
          <line x1="240" y1="148" x2="400" y2="148" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="280" y1="98" x2="360" y2="98" stroke="#F43F5E" strokeWidth="2.5" />
          <polygon points="320,44 360,98 280,98" fill={accent} fillOpacity="0.28" stroke={volt} strokeWidth="2.5" />
          <circle cx="320" cy="44" r="7" fill={volt} />
          <text x="320" y="28" textAnchor="middle" fill={volt} fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            APEX FLOW · EFFORTLESS MASTERY
          </text>
          <text x="492" y="228" fill="#10B981" fontSize="10" fontFamily="JetBrains Mono, monospace">L1 · YOU</text>
          <text x="452" y="178" fill="#F59E0B" fontSize="10" fontFamily="JetBrains Mono, monospace">L2 · ME</text>
          <text x="412" y="128" fill="#F43F5E" fontSize="10" fontFamily="JetBrains Mono, monospace">L3 · US</text>
          <text x="372" y="78" fill={accent} fontSize="10" fontFamily="JetBrains Mono, monospace">L4 · YOU</text>
        </g>
      );

    default:
      return (
        <g>
          {/* 3-node execution pipeline for remaining diagrams */}
          {[
            { x: 112, step: '01', title: 'PREPARATION' },
            { x: 320, step: '02', title: 'EXECUTION' },
            { x: 528, step: '03', title: 'MASTERY' },
          ].map((node, i) => (
            <g key={node.step}>
              {i < 2 && (
                <line
                  x1={node.x + 68}
                  y1="150"
                  x2={node.x + 140}
                  y2="150"
                  stroke={volt}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}
              <rect
                x={node.x - 68}
                y="104"
                width="136"
                height="92"
                fill={i === 1 ? 'rgba(223,255,0,0.10)' : 'rgba(244,244,238,0.04)'}
                stroke={i === 1 ? volt : accent}
                strokeWidth="2"
              />
              <text
                x={node.x}
                y="138"
                textAnchor="middle"
                fill={i === 1 ? volt : accent}
                fontSize="18"
                fontWeight="700"
                fontFamily="Anton, sans-serif"
              >
                {node.step}
              </text>
              <text
                x={node.x}
                y="168"
                textAnchor="middle"
                fill={chalk}
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
              >
                {node.title}
              </text>
            </g>
          ))}
        </g>
      );
  }
}
