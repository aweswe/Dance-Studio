import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ROUTES, ACADEMY } from "@/lib/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { PrintButton } from "@/components/shared/print-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Receipt | Rhythmzz Academy of Dance",
};

function monthLabel(for_month: string | null, paid_at: string): string {
  const d = new Date(for_month || paid_at);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`${ROUTES.login}?redirect=${encodeURIComponent(`/receipt/${id}`)}`);

  const { data: payment } = await supabase
    .from("fee_payments")
    .select("id, amount, source, notes, paid_at, for_month, student:students(id, name, phone, auth_id, programme:programmes(name))")
    .eq("id", id)
    .single();

  const p = payment as any;
  if (!p || !p.student) redirect(ROUTES.home);

  // Only the paying student (or an admin) may view a receipt.
  const { data: viewerRole } = await supabase.from("users").select("role").eq("id", user.id).single();
  if ((viewerRole as any)?.role !== "admin" && p.student.auth_id !== user.id) {
    redirect(ROUTES.home);
  }

  const sourceLabel = p.source === "razorpay" ? "Razorpay (Online)" : p.source === "upi_offline" ? "UPI" : "Cash";

  return (
    <main className="min-h-screen bg-canvas-muted py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="bg-surface border border-line p-10">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-ink pb-8 mb-8">
            <div>
              <h1 className="font-display text-3xl text-ink tracking-[2px]">RHYTHMZZ</h1>
              <p className="text-xs text-ink-2 uppercase tracking-[3px] mt-1">Academy of Dance</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg text-ink tracking-wide">PAYMENT RECEIPT</p>
              <p className="text-xs text-ink-2 mt-1">Receipt No: {p.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-ink-2">Date: {formatDate(p.paid_at)}</p>
            </div>
          </div>

          {/* Academy details */}
          <div className="text-sm text-ink-2 mb-8 space-y-0.5">
            <p>{ACADEMY.name}</p>
            <p>{ACADEMY.address.full}</p>
            <p>Phone: {ACADEMY.phoneDisplay ?? ACADEMY.phone}</p>
          </div>

          {/* Receipt body */}
          <div className="border border-line rounded-lg overflow-hidden mb-8">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line-subtle">
                <tr>
                  <td className="px-4 py-3 text-ink-2 w-1/3">Received From</td>
                  <td className="px-4 py-3 font-medium">{p.student.name}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink-2">Phone</td>
                  <td className="px-4 py-3">{p.student.phone || "—"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink-2">Programme</td>
                  <td className="px-4 py-3">{p.student.programme?.name || "—"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink-2">Covers Month</td>
                  <td className="px-4 py-3">{monthLabel(p.for_month, p.paid_at)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink-2">Payment Method</td>
                  <td className="px-4 py-3">{sourceLabel}</td>
                </tr>
                {p.notes && (
                  <tr>
                    <td className="px-4 py-3 text-ink-2">Notes</td>
                    <td className="px-4 py-3">{p.notes}</td>
                  </tr>
                )}
                <tr className="bg-canvas-muted-2/60">
                  <td className="px-4 py-4 font-display text-base tracking-wide text-ink">AMOUNT PAID</td>
                  <td className="px-4 py-4 font-display text-xl text-ink">{formatCurrency(p.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-ink-2 leading-relaxed">
            <p>Thank you for dancing with us!</p>
            <p className="mt-1">This is a computer-generated receipt. For queries, call {ACADEMY.phoneDisplay ?? ACADEMY.phone}.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
