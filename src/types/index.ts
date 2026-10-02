export type QualityLevel = '144p' | '240p' | '360p' | '480p' | '720p' | '1080p';

export type MonsterPos =
  | 'BEHIND_CAMERA'
  | 'DOORWAY'
  | 'WINDOW'
  | 'MIRROR'
  | 'CORNER'
  | 'GONE';

export type ClueID =
  | 'CLUE_LETTER_A'
  | 'CLUE_LETTER_B'
  | 'CLUE_NUMBER_1'
  | 'CLUE_NUMBER_2'
  | 'CLUE_FINAL';

export type HeartbeatRate = 'off' | 'slow' | 'fast' | 'frantic';

export type GamePhase = 'INTRO' | 'PLAYING' | 'WIN' | 'JUMPSCARE';

export interface QualityConfig {
  label: string;
  lightLevel: number;
  noiseAmount: number;
  monsterPosition: MonsterPos;
  clueVisible: ClueID[];
  ambientVolume: number;
  heartbeatRate: HeartbeatRate;
  filterCSS: string;
}

export interface GameState {
  phase: GamePhase;
  currentQuality: QualityLevel;
  qualitySwitchCount: number;
  discoveredClues: Set<ClueID>;
  codeAttempts: number;
  enteredCode: string;
  frame: number;
  lastQualitySwitch: number;
  subtitleMessage?: string;
}
