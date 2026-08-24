import { useEffect, useRef } from 'react';
import { RoomRenderer } from '../../game/RoomRenderer';
import type { ClueID, MonsterPos } from '../../types';

interface VideoCanvasProps {
  lightLevel: number;
  noiseAmount: number;
  monsterPosition: MonsterPos;
  clueVisible: ClueID[];
  frame: number;
  filterCSS: string;
}

export default function VideoCanvas({
  lightLevel,
  noiseAmount,
  monsterPosition,
  clueVisible,
  frame,
  filterCSS,
}: VideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<RoomRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    rendererRef.current = new RoomRenderer(canvasRef.current);
  }, []);

  useEffect(() => {
    rendererRef.current?.render({
      lightLevel,
      noiseAmount,
      monsterPosition,
      clueVisible,
      frame,
    });
  }, [lightLevel, noiseAmount, monsterPosition, clueVisible, frame]);

  return (
    <div className="video-area h-full w-full" style={{ filter: filterCSS }}>
      <canvas ref={canvasRef} width={1280} height={720} className="h-full w-full object-cover" />
    </div>
  );
}
