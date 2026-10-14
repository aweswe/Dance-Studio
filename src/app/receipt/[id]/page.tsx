import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";
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
  const { getCurrentStudent } = await import("@/lib/auth/student");
  const { student: currentStudent, user } = await getCurrentStudent();
  const adminSupabase = createAdminSupabase();

  const { data: payment } = await adminSupabase
    .from("fee_payments")
    .select("id, amount, source, notes, paid_at, for_month, receipt_number, student:students(id, name, phone, auth_id, programme:programmes(name))")
    .eq("id", id)
    .single();

  const p = payment as any;
  if (!p || !p.student) redirect(ROUTES.home);

  // Allow paying student, demo student preview, or admin
  const isOwner = currentStudent?.id === p.student.id || (user && p.student.auth_id === user.id);
  if (!isOwner) {
    if (user) {
      const { data: viewerRole } = await adminSupabase.from("users").select("role").eq("id", user.id).single();
      if ((viewerRole as any)?.role !== "admin") {
        redirect(ROUTES.home);
      }
    } else {
      redirect(ROUTES.login);
    }
  }

  const sourceLabel = p.source === "razorpay" ? "Razorpay (Online)" : p.source === "upi_offline" ? "UPI" : "Cash";

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4 print:py-0 print:px-0 print:bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-8 mb-8">
            <div>
              <h1 className="font-display text-3xl text-slate-950 tracking-[2px]">RHYTHMZZ</h1>
              <p className="text-xs text-slate-800 uppercase tracking-[3px] mt-1 font-bold">Academy of Dance</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg text-slate-950 tracking-wide">PAYMENT RECEIPT</p>
              <p className="text-xs text-slate-800 font-mono font-semibold mt-1">GST Receipt No: {p.receipt_number || p.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-slate-800 font-semibold">Date: {formatDate(p.paid_at)}</p>
            </div>
          </div>

          {/* Academy details */}
          <div className="text-sm text-slate-800 mb-8 space-y-0.5 font-medium">
            <p className="font-bold text-slate-950">{ACADEMY.name}</p>
            <p>{ACADEMY.address.full}</p>
            <p>Phone: {ACADEMY.phoneDisplay ?? ACADEMY.phone}</p>
          </div>

          {/* Receipt body */}
          <div className="border-2 border-slate-200 rounded-lg overflow-hidden mb-8 shadow-inner">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-5 py-3.5 text-slate-700 font-bold w-1/3 bg-slate-50">Received From</td>
                  <td className="px-5 py-3.5 font-bold text-slate-950">{p.student.name}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-slate-700 font-bold bg-slate-50">Phone</td>
                  <td className="px-5 py-3.5 text-slate-950 font-medium font-mono">{p.student.phone || "—"}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-slate-700 font-bold bg-slate-50">Programme</td>
                  <td className="px-5 py-3.5 text-slate-950 font-semibold">{p.student.programme?.name || "—"}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-slate-700 font-bold bg-slate-50">Covers Month</td>
                  <td className="px-5 py-3.5 text-slate-950 font-semibold">{monthLabel(p.for_month, p.paid_at)}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-slate-700 font-bold bg-slate-50">Payment Method</td>
                  <td className="px-5 py-3.5 text-slate-950 font-semibold">{sourceLabel}</td>
                </tr>
                {p.notes && (
                  <tr>
                    <td className="px-5 py-3.5 text-slate-700 font-bold bg-slate-50">Notes</td>
                    <td className="px-5 py-3.5 text-slate-900 font-medium">{p.notes}</td>
                  </tr>
                )}
                <tr className="bg-slate-950 text-white">
                  <td className="px-5 py-4 font-display text-base tracking-wide text-white font-bold">AMOUNT PAID</td>
                  <td className="px-5 py-4 font-display text-2xl text-white font-black">{formatCurrency(p.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-700 leading-relaxed font-medium">
            <p className="font-semibold text-slate-900">Thank you for dancing with us!</p>
            <p className="mt-0.5">This is a GST-style computer-generated receipt ({p.receipt_number || "pending number"}). For queries, call {ACADEMY.phoneDisplay ?? ACADEMY.phone}.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
