import { useEffect, useRef } from 'react';
import { QUALITY_CONFIG, QUALITY_LEVELS } from '../../game/constants';
import type { QualityLevel } from '../../types';

interface QualityMenuProps {
  open: boolean;
  currentQuality: QualityLevel;
  onSelect: (quality: QualityLevel) => void;
  onClose: () => void;
}

export default function QualityMenu({ open, currentQuality, onSelect, onClose }: QualityMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-14 right-6 z-30 w-52 rounded-lg border border-[var(--yt-border)] bg-[#212121] p-2 text-sm shadow-xl"
    >
      <div className="border-b border-[var(--yt-border)] px-2 pb-2 font-medium text-[var(--yt-text)]">Quality</div>
      <div className="pt-2">
        {QUALITY_LEVELS.map((quality) => {
          const selected = quality === currentQuality;
          return (
            <button
              key={quality}
              type="button"
              onClick={() => onSelect(quality)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-white/10"
            >
              <span className={`inline-block h-2 w-2 rounded-full ${selected ? 'bg-[var(--yt-red)]' : 'border border-zinc-400'}`} />
              <span className={selected ? 'font-bold text-[var(--yt-text)]' : 'text-[var(--yt-subtext)]'}>
                {QUALITY_CONFIG[quality].label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
