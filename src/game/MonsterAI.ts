import type { MonsterPos, QualityLevel } from '../types';
import { QUALITY_CONFIG } from './constants';

export const getMonsterPositionForQuality = (quality: QualityLevel): MonsterPos =>
  QUALITY_CONFIG[quality].monsterPosition;

export const isDangerState = (quality: QualityLevel): boolean => quality === '144p' || quality === '240p';
