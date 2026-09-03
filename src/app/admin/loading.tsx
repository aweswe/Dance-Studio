export default function AdminLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-5">
        <div className="w-11 h-11 rounded-full border-2 border-bl/20 border-t-bl animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-bl font-display font-black text-xs">
          R
        </span>
      </div>
      <p className="text-xs uppercase tracking-[2.5px] font-semibold text-ink-2 animate-pulse">
        Loading Admin Workspace...
      </p>
    </div>
  );
}
