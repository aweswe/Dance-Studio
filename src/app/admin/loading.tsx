export default function AdminLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-8 h-8 rounded-full border-2 border-line border-t-bl animate-spin mb-4" />
      <p className="text-sm text-ink-3">Loading…</p>
    </div>
  );
}
