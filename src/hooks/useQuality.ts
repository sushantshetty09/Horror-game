import { useCallback, useState } from 'react';
import type { QualityLevel } from '../types';

export function useQuality(initial: QualityLevel) {
  const [selectedQuality, setSelectedQuality] = useState<QualityLevel>(initial);
  const [menuOpen, setMenuOpen] = useState(false);

  const chooseQuality = useCallback((quality: QualityLevel) => {
    setSelectedQuality(quality);
    setMenuOpen(false);
  }, []);

  return {
    selectedQuality,
    menuOpen,
    setMenuOpen,
    chooseQuality,
  };
}
