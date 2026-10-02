import { useEffect, useRef } from 'react';

interface StaticTransitionProps {
  active: boolean;
}

export default function StaticTransition({ active }: StaticTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = Math.random() * 255;
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={360}
      className={`pointer-events-none absolute inset-0 h-full w-full ${active ? 'animate-static-flash opacity-90' : 'opacity-0'}`}
      aria-hidden
    />
  );
}
