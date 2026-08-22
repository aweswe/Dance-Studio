import Link from "next/link";
import { ACADEMY, ROUTES } from "@/lib/utils/constants";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-blk text-center px-6">
      <h1 className="font-display text-[120px] leading-none tracking-wider text-bl">
        404
      </h1>
      <div className="w-px h-10 bg-white/10 my-4" />
      <p className="text-sm tracking-[4px] uppercase text-white/30 mb-6">
        Page not found
      </p>
      <p className="text-sm text-white/50 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist. But the dance floor
        is always open at {ACADEMY.name}.
      </p>
      <div className="flex gap-3">
        <Link
          href={ROUTES.home}
          className="bg-bl text-white text-[11px] font-semibold tracking-[2px] uppercase px-8 py-3.5 hover:opacity-85 transition-opacity"
        >
          Back Home
        </Link>
        <Link
          href={ROUTES.contact}
          className="border border-white/20 text-white text-[11px] font-medium tracking-[2px] uppercase px-7 py-3 hover:border-bl hover:text-bl transition-all"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}
