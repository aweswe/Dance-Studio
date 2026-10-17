export default function StudentLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-[3px] border-line border-t-bl animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-bl font-anton text-lg">
          R
        </span>
      </div>
      <p className="text-sm font-medium text-ink-2">Loading student portal…</p>
    </div>
  );
}
