import type { ReactNode } from 'react';

interface ScribbleTextProps {
  children: ReactNode;
  color?: string;
}

/**
 * Signature Head Coach marker-stroke underline motif inspired by headcoach.com.au.
 */
export function ScribbleText({ children, color = '#DFFF00' }: ScribbleTextProps) {
  return (
    <span className="hc-scribble">
      <span className="hc-scribble__text">{children}</span>
      <svg
        className="hc-scribble__svg"
        viewBox="0 0 220 22"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M3 16.5C44 9.5 138 6.5 217 12.5"
          fill="none"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M16 19.5C72 14.5 148 13.5 202 16.5"
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.72"
        />
      </svg>
    </span>
  );
}
