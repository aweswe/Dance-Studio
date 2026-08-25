#!/bin/bash
# Regenerate Supabase types from the live DB and re-append the convenience
# aliases that `supabase gen types` wipes (use-supabase.ts depends on UserRole).
#
# Usage: scripts/regen-types.sh "postgresql://...db-url..."
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <db-url>" >&2
  exit 1
fi

/opt/homebrew/bin/supabase gen types typescript --db-url "$1" --schema public > src/lib/supabase/types.ts

cat >> src/lib/supabase/types.ts <<'EOF'

// Convenience aliases (not part of the generated output)
export type UserRole = Database["public"]["Enums"]["user_role"];
export type AttendanceStatus = Database["public"]["Enums"]["attendance_status"];
export type PaymentSource = Database["public"]["Enums"]["payment_source"];
export type BatchStatus = Database["public"]["Enums"]["batch_status"];
EOF

echo "types.ts regenerated with aliases ($(wc -l < src/lib/supabase/types.ts) lines)"
