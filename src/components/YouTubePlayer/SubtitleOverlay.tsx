interface SubtitleOverlayProps {
  subtitle: string;
}

export default function SubtitleOverlay({ subtitle }: SubtitleOverlayProps) {
  return (
    <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 -translate-x-1/2 rounded bg-black/75 px-3 py-1 text-center text-base text-white">
      {subtitle}
    </div>
  );
}
