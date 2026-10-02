import type { GameState, QualityLevel } from '../types';
import { mergeDiscoveredClues } from './ClueSystem';
import { QUALITY_CONFIG, WIN_CODE } from './constants';

export const createInitialState = (): GameState => ({
  phase: 'INTRO',
  currentQuality: '144p',
  qualitySwitchCount: 0,
  discoveredClues: new Set(),
  codeAttempts: 0,
  enteredCode: '',
  frame: 0,
  lastQualitySwitch: 0,
});

export const startGame = (state: GameState): GameState => ({ ...state, phase: 'PLAYING' });

export const tickFrame = (state: GameState): GameState => ({ ...state, frame: state.frame + 1 });

export const switchQuality = (state: GameState, nextQuality: QualityLevel): GameState => {
  const discoveredClues = mergeDiscoveredClues(state.discoveredClues, nextQuality);
  const shouldJumpscare =
    state.currentQuality === '240p' && nextQuality === '144p' && QUALITY_CONFIG[nextQuality].heartbeatRate === 'frantic';

  return {
    ...state,
    phase: shouldJumpscare ? 'JUMPSCARE' : state.phase,
    currentQuality: nextQuality,
    qualitySwitchCount: state.qualitySwitchCount + 1,
    discoveredClues,
    lastQualitySwitch: Date.now(),
  };
};

export const completeJumpscare = (state: GameState): GameState => ({
  ...state,
  phase: state.phase === 'JUMPSCARE' ? 'PLAYING' : state.phase,
});

export const updateEnteredCode = (state: GameState, enteredCode: string): GameState => ({ ...state, enteredCode });

export const submitCode = (state: GameState): GameState => {
  const normalized = state.enteredCode.trim().toUpperCase();

  if (normalized === WIN_CODE) {
    return { ...state, phase: 'WIN' };
  }

  return {
    ...state,
    codeAttempts: state.codeAttempts + 1,
    subtitleMessage: '...not yet.',
  };
};
