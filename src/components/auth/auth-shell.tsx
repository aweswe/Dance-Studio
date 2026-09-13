import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AuthShell({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-canvas px-4 py-8 sm:px-6 sm:py-12 flex flex-col">
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
        <Link href="/" className="font-anton text-xl text-ink tracking-tight focus-visible:focus-ring rounded-lg">
          Rhythmzz
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md mx-auto bg-surface-card border border-line shadow-lift rounded-[24px] p-5 sm:p-8">
        {eyebrow && <p className="text-[11px] text-ink-3 mb-1">{eyebrow}</p>}
        <h1 className="font-anton text-3xl text-ink tracking-tight mb-6">{title}</h1>
        {children}
      </div>

      {footer && <div className="w-full max-w-md mx-auto mt-6 text-center text-xs text-ink-3">{footer}</div>}
    </main>
  );
}
