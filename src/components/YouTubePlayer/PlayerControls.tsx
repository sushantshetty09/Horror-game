interface PlayerControlsProps {
  progress: number;
  qualityLabel: string;
  onToggleQualityMenu: () => void;
}

export default function PlayerControls({ progress, qualityLabel, onToggleQualityMenu }: PlayerControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 to-transparent">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="controls-strip h-10 text-sm">
        <button type="button" className="rounded px-1 text-white" aria-label="Play">
          ▶
        </button>
        <span className="text-xs text-[var(--yt-subtext)]">13:37</span>
        <div className="ml-auto flex items-center gap-3 text-[var(--yt-subtext)]">
          <span className="text-xs">{qualityLabel}</span>
          <button
            type="button"
            onClick={onToggleQualityMenu}
            className="rounded p-1 text-lg leading-none text-white hover:bg-white/10"
            aria-label="Quality settings"
          >
            ⚙
          </button>
          <span className="text-base">⛶</span>
        </div>
      </div>
    </div>
  );
}
