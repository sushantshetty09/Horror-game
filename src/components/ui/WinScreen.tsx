export default function WinScreen() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
      <div className="rounded-xl border border-emerald-400/40 bg-black/80 px-8 py-7 text-center shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold text-emerald-300">YOU ESCAPED</h2>
        <p className="text-sm text-[var(--yt-subtext)]">The tape stops. The room is finally empty.</p>
      </div>
    </div>
  );
}
