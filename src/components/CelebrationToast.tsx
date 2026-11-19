import { Sparkles, Trophy, Zap } from 'lucide-react';

export interface ToastPayload {
  id: number;
  title: string;
  subtitle: string;
  xpLabel?: string;
  variant?: 'drill' | 'challenge' | 'rank';
}

interface CelebrationToastProps {
  toast: ToastPayload | null;
}

export function CelebrationToast({ toast }: CelebrationToastProps) {
  if (!toast) return null;

  const Icon =
    toast.variant === 'rank'
      ? Trophy
      : toast.variant === 'challenge'
      ? Zap
      : Sparkles;

  return (
    <div
      key={toast.id}
      className={`hc-toast hc-toast--${toast.variant ?? 'drill'}`}
      role="status"
      aria-live="polite"
    >
      <div className="hc-toast__icon" aria-hidden="true">
        <Icon size={18} />
      </div>
      <div className="hc-toast__body">
        <strong>{toast.title}</strong>
        <span>{toast.subtitle}</span>
      </div>
      {toast.xpLabel && <span className="hc-toast__xp">{toast.xpLabel}</span>}
    </div>
  );
}
