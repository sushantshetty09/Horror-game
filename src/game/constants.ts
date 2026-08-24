import type { ClueID, QualityConfig, QualityLevel } from '../types';

export const QUALITY_LEVELS: QualityLevel[] = ['144p', '240p', '360p', '480p', '720p', '1080p'];

export const QUALITY_CONFIG: Record<QualityLevel, QualityConfig> = {
  '144p': {
    label: 'Auto (144p)',
    lightLevel: 0.05,
    noiseAmount: 0.95,
    monsterPosition: 'BEHIND_CAMERA',
    clueVisible: [],
    ambientVolume: 1,
    heartbeatRate: 'frantic',
    filterCSS: 'brightness(0.08) contrast(3) saturate(0) blur(2px)',
  },
  '240p': {
    label: '240p',
    lightLevel: 0.2,
    noiseAmount: 0.7,
    monsterPosition: 'DOORWAY',
    clueVisible: ['CLUE_LETTER_A'],
    ambientVolume: 0.9,
    heartbeatRate: 'fast',
    filterCSS: 'brightness(0.2) contrast(2.5) saturate(0.2) blur(1px)',
  },
  '360p': {
    label: '360p',
    lightLevel: 0.35,
    noiseAmount: 0.5,
    monsterPosition: 'WINDOW',
    clueVisible: ['CLUE_LETTER_A', 'CLUE_LETTER_B'],
    ambientVolume: 0.7,
    heartbeatRate: 'slow',
    filterCSS: 'brightness(0.35) contrast(2) saturate(0.4)',
  },
  '480p': {
    label: '480p',
    lightLevel: 0.55,
    noiseAmount: 0.3,
    monsterPosition: 'MIRROR',
    clueVisible: ['CLUE_LETTER_A', 'CLUE_LETTER_B', 'CLUE_NUMBER_1'],
    ambientVolume: 0.5,
    heartbeatRate: 'slow',
    filterCSS: 'brightness(0.55) contrast(1.6) saturate(0.6)',
  },
  '720p': {
    label: '720p HD',
    lightLevel: 0.75,
    noiseAmount: 0.1,
    monsterPosition: 'CORNER',
    clueVisible: ['CLUE_LETTER_A', 'CLUE_LETTER_B', 'CLUE_NUMBER_1', 'CLUE_NUMBER_2'],
    ambientVolume: 0.3,
    heartbeatRate: 'off',
    filterCSS: 'brightness(0.75) contrast(1.2) saturate(0.85)',
  },
  '1080p': {
    label: '1080p HD',
    lightLevel: 1,
    noiseAmount: 0,
    monsterPosition: 'GONE',
    clueVisible: ['CLUE_LETTER_A', 'CLUE_LETTER_B', 'CLUE_NUMBER_1', 'CLUE_NUMBER_2', 'CLUE_FINAL'],
    ambientVolume: 0.1,
    heartbeatRate: 'off',
    filterCSS: 'brightness(1) contrast(1) saturate(1)',
  },
};

export const SUBTITLE_BY_QUALITY: Record<QualityLevel, string> = {
  '144p': '[corrupted] ̡̙̦̥̝͚̳̮ ̣̜̙ ̷̘͓',
  '240p': '...it changes when you look closer...',
  '360p': "...still watching. The room. It's the same room.",
  '480p': 'The letters on the wall. Read them in order.',
  '720p': 'A...B...12. You know what comes next.',
  '1080p': 'You can see everything now. Type it. End this.',
};

export const CLUE_ORDER: ClueID[] = [
  'CLUE_LETTER_A',
  'CLUE_LETTER_B',
  'CLUE_NUMBER_1',
  'CLUE_NUMBER_2',
  'CLUE_FINAL',
];

export const WIN_CODE = 'AB12EXIT';
