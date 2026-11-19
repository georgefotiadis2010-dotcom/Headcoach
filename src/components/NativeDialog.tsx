import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface NativeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  accent?: string;
  closedBy?: 'any' | 'closerequest';
  children: ReactNode;
}

/**
 * Accessible modal built on native <dialog> + showModal(), following modern-web-guidance:
 * - No redundant role="dialog" or aria-modal
 * - No body scroll lock (relies on CSS overscroll-behavior: contain on dialog:modal & ::backdrop)
 * - Supports closedby="any" with pointerdown/pointerup coordinate fallback where unsupported
 */
export function NativeDialog({
  open,
  onClose,
  title,
  eyebrow,
  accent = '#DFFF00',
  closedBy = 'any',
  children,
}: NativeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    // Fallback for browsers without native closedby support (e.g. Safari)
    let cleanupOutside: (() => void) | undefined;
    if (
      closedBy === 'any' &&
      typeof HTMLDialogElement !== 'undefined' &&
      !('closedBy' in HTMLDialogElement.prototype)
    ) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const r = dialog.getBoundingClientRect();
        return (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        );
      };
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e) && dialog.open) {
          dialog.close();
        }
        pressedOutside = false;
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      cleanupOutside = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupOutside?.();
    };
  }, [closedBy, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="hc-dialog"
      aria-labelledby={titleId}
      style={{ ['--dialog-accent' as string]: accent }}
      {...({ closedby: closedBy } as Record<string, string>)}
    >
      <div className="hc-dialog__header">
        <div className="hc-dialog__titles">
          {eyebrow && (
            <span className="hc-mono-tag" style={{ color: accent }}>
              {eyebrow}
            </span>
          )}
          <h2 id={titleId} className="hc-dialog__title">
            {title}
          </h2>
        </div>
        <button
          type="button"
          className="hc-icon-btn"
          aria-label="Close dialog"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="hc-dialog__body">{children}</div>
    </dialog>
  );
}
