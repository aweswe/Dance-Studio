import { createAdminSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Health check & Supabase keep-alive endpoint.
 *
 * Hitting this endpoint queries and updates the database heartbeat,
 * generating active PostgREST API traffic on Supabase to prevent
 * the 7-day free tier inactivity pause.
 *
 * Can be triggered by:
 * - GitHub Actions cron (.github/workflows/cron.yml)
 * - Free Uptime monitors (UptimeRobot, Cron-job.org)
 * - Direct HTTP GET
 */
export async function GET() {
  const start = Date.now();

  try {
    const supabase = createAdminSupabase();

    // 1. Try invoking the dedicated touch_supabase_keepalive RPC if migrated
    let keepaliveSuccess = false;
    let pingInfo: any = null;

    const { data: rpcData, error: rpcError } = await (supabase.rpc as any)('touch_supabase_keepalive', {
      p_source: 'api_health_ping',
    });

    if (!rpcError && rpcData) {
      keepaliveSuccess = true;
      pingInfo = { touchedAt: rpcData, method: 'rpc' };
    } else {
      // Fallback: Query programmes table directly to guarantee PostgREST activity
      const { data: progData, error: progError } = await supabase
        .from('programmes')
        .select('id, name')
        .limit(1);

      if (progError) {
        return Response.json(
          {
            status: 'degraded',
            error: progError.message,
            latencyMs: Date.now() - start,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        );
      }

      pingInfo = { sample: progData?.[0]?.name ?? 'ok', method: 'fallback_query' };
    }

    return Response.json({
      status: 'healthy',
      database: 'connected',
      keepalive: pingInfo,
      latencyMs: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return Response.json(
      {
        status: 'error',
        error: err?.message || 'Unknown health check failure',
        latencyMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
