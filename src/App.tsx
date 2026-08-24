import { useEffect, useState } from 'react';
import YouTubePlayer from './components/YouTubePlayer';
import { QUALITY_CONFIG } from './game/constants';
import { useAudio } from './hooks/useAudio';
import { useGameState } from './hooks/useGameState';
import { useQuality } from './hooks/useQuality';

export default function App() {
  const { state, actions } = useGameState();
  const { selectedQuality, menuOpen, setMenuOpen, chooseQuality } = useQuality(state.currentQuality);
  const [staticActive, setStaticActive] = useState(false);
  const audio = useAudio();

  useEffect(() => {
    chooseQuality(state.currentQuality);
  }, [state.currentQuality, chooseQuality]);

  useEffect(() => {
    if (state.phase !== 'WIN') return;
    audio.onWin();
  }, [state.phase, audio]);

  const handleStart = async () => {
    await audio.ensureContext();
    await audio.startAmbient();
    const base = QUALITY_CONFIG[state.currentQuality];
    audio.onQualitySwitch(base.ambientVolume, base.heartbeatRate);
    actions.start();
  };

  const handleSelectQuality = async (quality: keyof typeof QUALITY_CONFIG) => {
    await audio.ensureContext();
    setStaticActive(true);
    window.setTimeout(() => setStaticActive(false), 300);

    chooseQuality(quality);
    actions.switchQuality(quality);

    const config = QUALITY_CONFIG[quality];
    audio.onQualitySwitch(config.ambientVolume, config.heartbeatRate);
  };

  return (
    <div className="min-h-screen bg-[var(--yt-bg)] text-[var(--yt-text)]">
      <YouTubePlayer
        phase={state.phase}
        quality={selectedQuality}
        frame={state.frame}
        enteredCode={state.enteredCode}
        staticActive={staticActive}
        qualityMenuOpen={menuOpen}
        onStart={handleStart}
        onToggleQualityMenu={() => setMenuOpen((open) => !open)}
        onCloseQualityMenu={() => setMenuOpen(false)}
        onSelectQuality={handleSelectQuality}
        onCodeChange={actions.setCode}
        onSubmitCode={actions.submitCode}
      />
    </div>
  );
}
