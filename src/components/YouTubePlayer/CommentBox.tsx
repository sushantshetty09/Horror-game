import { useState } from 'react';

interface CommentBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CommentBox({ value, onChange, onSubmit }: CommentBoxProps) {
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (value.trim().toUpperCase() !== 'AB12EXIT') {
      setShake(true);
      window.setTimeout(() => setShake(false), 350);
    }
    onSubmit();
  };

  return (
    <section className="px-1 pb-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--yt-subtext)]">COMMENTS (1)</p>
      <div
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit();
        }}
        className="flex items-center gap-2"
      >
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter the code if you know the truth..."
          className={`w-full rounded-full border bg-transparent px-4 py-2 text-sm text-[var(--yt-text)] outline-none transition ${
            shake ? 'animate-shake border-red-500' : 'border-[var(--yt-border)] focus:border-zinc-500'
          }`}
        />
        <button
          type="button"
          onClick={submit}
          className="rounded-full border border-[var(--yt-border)] px-4 py-2 text-sm text-[var(--yt-text)] hover:bg-white/10"
        >
          Submit
        </button>
      </div>
    </section>
  );
}
