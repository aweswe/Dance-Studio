export default function RootLoading() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-bl/20 border-t-bl animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-bl font-display font-black text-sm">
          R
        </span>
      </div>
      <p className="text-xs uppercase tracking-[3px] font-semibold text-ink-2 animate-pulse">
        Loading Rhythmzz...
      </p>
    </div>
  );
}
