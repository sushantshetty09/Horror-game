import { QUALITY_CONFIG, SUBTITLE_BY_QUALITY } from '../../game/constants';
import type { GamePhase, QualityLevel } from '../../types';
import CommentBox from './CommentBox';
import InfoPanel from './InfoPanel';
import PlayerControls from './PlayerControls';
import QualityMenu from './QualityMenu';
import SubtitleOverlay from './SubtitleOverlay';
import VideoCanvas from './VideoCanvas';
import IntroModal from '../ui/IntroModal';
import StaticTransition from '../ui/StaticTransition';
import WinScreen from '../ui/WinScreen';

interface YouTubePlayerProps {
  phase: GamePhase;
  quality: QualityLevel;
  frame: number;
  enteredCode: string;
  staticActive: boolean;
  qualityMenuOpen: boolean;
  onStart: () => void;
  onToggleQualityMenu: () => void;
  onCloseQualityMenu: () => void;
  onSelectQuality: (quality: QualityLevel) => void;
  onCodeChange: (value: string) => void;
  onSubmitCode: () => void;
}

export default function YouTubePlayer({
  phase,
  quality,
  frame,
  enteredCode,
  staticActive,
  qualityMenuOpen,
  onStart,
  onToggleQualityMenu,
  onCloseQualityMenu,
  onSelectQuality,
  onCodeChange,
  onSubmitCode,
}: YouTubePlayerProps) {
  const qualityState = QUALITY_CONFIG[quality];

  return (
    <main className="mx-auto max-w-5xl px-3 py-4">
      <div className="player-wrapper rounded-xl bg-[var(--yt-player-bg)]">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <VideoCanvas
            lightLevel={qualityState.lightLevel}
            noiseAmount={qualityState.noiseAmount}
            monsterPosition={qualityState.monsterPosition}
            clueVisible={qualityState.clueVisible}
            frame={frame}
            filterCSS={qualityState.filterCSS}
          />
          <SubtitleOverlay subtitle={SUBTITLE_BY_QUALITY[quality]} />
          <StaticTransition active={staticActive} />
          {phase === 'INTRO' && <IntroModal onStart={onStart} />}
          {phase === 'WIN' && <WinScreen />}
          {phase === 'JUMPSCARE' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-900/70 text-4xl font-bold tracking-widest text-white">
              DON'T LOOK AWAY
            </div>
          )}
          <PlayerControls progress={(frame % 1000) / 10} qualityLabel={qualityState.label} onToggleQualityMenu={onToggleQualityMenu} />
          <QualityMenu
            open={qualityMenuOpen}
            currentQuality={quality}
            onSelect={onSelectQuality}
            onClose={onCloseQualityMenu}
          />
        </div>
      </div>
      <InfoPanel />
      <CommentBox value={enteredCode} onChange={onCodeChange} onSubmit={onSubmitCode} />
    </main>
  );
}
