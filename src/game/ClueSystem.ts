import type { ClueID, QualityLevel } from '../types';
import { QUALITY_CONFIG } from './constants';

export const getCluesForQuality = (quality: QualityLevel): ClueID[] => QUALITY_CONFIG[quality].clueVisible;

export const mergeDiscoveredClues = (existing: Set<ClueID>, quality: QualityLevel): Set<ClueID> => {
  const merged = new Set(existing);
  for (const clue of getCluesForQuality(quality)) merged.add(clue);
  return merged;
};
