import { createServerSupabase } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AcknowledgeLeaveButtons } from "@/components/admin/acknowledge-leave";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Leave Requests | Admin" };

export default async function LeaveRequestsPage() {
  const supabase = await createServerSupabase();

  const { data: rows } = await supabase
    .from("leave_requests")
    .select(`
      id, date, notes, status, created_at,
      student:students(id, name, phone, email,
        programme:programmes(name),
        batch:batches(name)
      )
    `)
    .eq("kind", "platform_leave")
    .order("created_at", { ascending: false })
    .limit(100);

  const pending = (rows ?? []).filter((r: any) => r.status === "pending");
  const resolved = (rows ?? []).filter((r: any) => r.status !== "pending");

  return (
    <div className="space-y-8">
      <PageHeader
        label={`${pending.length} pending`}
        title="Leave requests"
        description="Students requesting to withdraw from the programme"
      />

      {/* Pending */}
      <section className="space-y-3">
        {pending.length === 0 ? (
          <Card className="p-6 text-center text-sm text-ink-2">No pending withdrawal requests.</Card>
        ) : (
          pending.map((r: any) => (
            <LeaveCard key={r.id} row={r} showActions />
          ))
        )}
      </section>

      {/* Resolved */}
      {resolved.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[11px] text-ink-3 uppercase tracking-wider font-medium px-1">Resolved</h2>
          {resolved.map((r: any) => (
            <LeaveCard key={r.id} row={r} showActions={false} />
          ))}
        </section>
      )}
    </div>
  );
}

function LeaveCard({ row, showActions }: { row: any; showActions: boolean }) {
  const student = row.student;
  const isResolved = row.status !== "pending";

  return (
    <Card className={`p-5 space-y-4 ${isResolved ? "opacity-60" : "border-danger/20"}`}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/admin/students/${student?.id}`}
              className="text-sm font-semibold text-ink hover:text-bl flex items-center gap-1 focus-visible:focus-ring rounded"
            >
              {student?.name ?? "Unknown student"}
              <ArrowUpRight className="w-3.5 h-3.5 text-ink-3" />
            </Link>
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded capitalize ${
              row.status === "pending"
                ? "bg-gold/15 text-gold"
                : row.status === "approved"
                  ? "bg-danger/10 text-danger"
                  : "bg-canvas-muted text-ink-3"
            }`}>
              {row.status === "approved" ? "Access revoked" : row.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-ink-3 flex-wrap">
            {student?.programme?.name && <span>{student.programme.name}</span>}
            {student?.batch?.name && <span>· {student.batch.name}</span>}
            {student?.phone && <span>· {student.phone}</span>}
            <span>· Submitted {formatDate(row.date, "long")}</span>
          </div>
        </div>
        {showActions && <AcknowledgeLeaveButtons id={row.id} />}
      </div>

      {/* Reason */}
      {row.notes && (
        <div className="bg-canvas-muted rounded-lg px-4 py-3 border border-line">
          <p className="text-[11px] text-ink-3 mb-1 uppercase tracking-wide font-medium">Reason</p>
          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{row.notes}</p>
        </div>
      )}
    </Card>
  );
}
