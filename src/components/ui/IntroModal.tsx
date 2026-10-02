interface IntroModalProps {
  onStart: () => void;
}

export default function IntroModal({ onStart }: IntroModalProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
      <div className="max-w-md rounded-xl border border-[var(--yt-border)] bg-[#121212] p-6 text-sm text-[var(--yt-text)] shadow-2xl">
        <p className="mb-5 leading-6">
          ⚠️ This video contains footage recovered from an abandoned property.
          <br />
          Viewer discretion is advised.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-full bg-[var(--yt-red)] px-4 py-2 font-semibold text-white transition hover:brightness-110"
        >
          PLAY VIDEO
        </button>
      </div>
    </div>
  );
}
