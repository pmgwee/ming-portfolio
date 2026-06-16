export function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
      {children}
    </span>
  );
}
