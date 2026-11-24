import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Share2 } from 'lucide-react';
import { PublicPage } from '@/components/public/public-page';
import { ROUTES } from '@/lib/utils/constants';
import { whatsappLink } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Enrolment Confirmed | Rhythmzz Academy',
  description: 'Your enrolment and payment have been successfully confirmed.',
};

export default async function EnrolSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ txId?: string; method?: string }>;
}) {
  const params = await searchParams;
  const txId = params.txId || 'Confirmed';
  const method = params.method === 'phonepe' ? 'PhonePe Gateway' : 'Online Payment';

  const shareText = `Hi Rhythmzz! I just completed my dance class enrolment and payment via ${method}. Transaction ID: ${txId}. Please confirm my batch schedule!`;

  return (
    <PublicPage>
      <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green/15 text-green flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={36} className="text-green" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-green font-bold bg-green/10 px-3 py-1 rounded-full">
            Payment Verified · {method}
          </span>
          <h1 className="font-anton text-3xl sm:text-4xl text-ink uppercase tracking-tight mt-2">
            Welcome to Rhythmzz!
          </h1>
          <p className="text-sm text-ink-2 max-w-md mx-auto">
            Your enrolment and payment have been securely processed. We are thrilled to have you join our dance family!
          </p>
        </div>

        {/* Transaction details card */}
        <div className="bg-surface p-5 rounded-lg border border-line text-left space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center py-1 border-b border-line/60">
            <span className="text-ink-3">Transaction ID</span>
            <span className="font-bold text-ink select-all">{txId}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-line/60">
            <span className="text-ink-3">Payment Method</span>
            <span className="font-semibold text-ink">{method}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-ink-3">Access</span>
            <span className="text-green font-bold">Student Portal Active</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={ROUTES.login}
            className="flex-1 min-h-11 h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-bl text-slate-950 font-bold hover:bg-bl-deep hover:text-slate-950 transition-colors text-sm"
          >
            <span>Student Portal Login</span>
            <ArrowRight size={16} />
          </Link>

          <a
            href={whatsappLink(shareText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-11 h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-line-strong text-ink hover:bg-canvas-muted transition-colors text-sm font-semibold"
          >
            <Share2 size={15} />
            <span>Share to WhatsApp</span>
          </a>
        </div>

        <p className="text-xs text-ink-3">
          Need assistance with your class timing?{' '}
          <a
            href={whatsappLink(`Hi Rhythmzz! My payment was confirmed (${txId}). Can you assist me?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bl font-semibold underline underline-offset-2"
          >
            Chat with studio desk
          </a>
        </p>
      </div>
    </PublicPage>
  );
}
