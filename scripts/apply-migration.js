#!/usr/bin/env node
/**
 * Apply a multi-statement SQL migration file to a live Supabase DB.
 *
 * `supabase db query -f` sends the whole file as ONE prepared statement,
 * which PostgreSQL rejects for multi-command files ("cannot insert
 * multiple commands into a prepared statement"). This script splits the
 * file into top-level statements — respecting $$ dollar-quoted function
 * bodies and -- line comments — and runs each through the CLI individually.
 *
 * Usage:
 *   node scripts/apply-migration.js <file.sql> --db-url "postgresql://..."
 *
 * Note: superseded by `supabase db push` once Phase 2 lands
 * (supabase/config.toml + supabase/migrations/).
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

const args = process.argv.slice(2);
const fileIdx = args.findIndex((a) => !a.startsWith('--'));
if (fileIdx === -1) {
  console.error('Usage: node scripts/apply-migration.js <file.sql> --db-url "<url>"');
  process.exit(1);
}
const file = args[fileIdx];
const dbUrlIdx = args.indexOf('--db-url');
if (dbUrlIdx === -1 || !args[dbUrlIdx + 1]) {
  console.error('Missing --db-url');
  process.exit(1);
}
const dbUrl = args[dbUrlIdx + 1];

const sql = fs.readFileSync(file, 'utf8');

/** Split SQL into top-level statements, ignoring ; inside $$…$$ blocks and -- comments. */
function splitStatements(src) {
  const statements = [];
  let current = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '-' && src[i + 1] === '-') {
      // line comment — copy to end of line
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? src.length : nl;
      current += src.slice(i, end);
      i = end;
      continue;
    }
    if (c === '$' && src[i + 1] === '$') {
      // dollar-quoted block — copy verbatim to closing $$
      const end = src.indexOf('$$', i + 2);
      if (end === -1) throw new Error(`Unterminated $$ block in ${file}`);
      current += src.slice(i, end + 2);
      i = end + 2;
      continue;
    }
    if (c === ';') {
      const stmt = current.trim();
      // skip comment-only statements (e.g. file header blocks)
      if (stmt && stmt.replace(/--.*$/gm, '').trim()) statements.push(stmt);
      current = '';
    } else {
      current += c;
    }
    i++;
  }
  const tail = current.trim();
  if (tail && tail.replace(/--.*$/gm, '').trim()) statements.push(tail);
  return statements;
}

const statements = splitStatements(sql);

if (args.includes('--dry-run')) {
  console.log(`Split into ${statements.length} statements:\n`);
  statements.forEach((s, i) =>
    console.log(`[${i + 1}] ${s.split('\n')[0].slice(0, 80)}${s.length > 80 ? '…' : ''}`),
  );
  process.exit(0);
}

const supabase = '/opt/homebrew/bin/supabase';
let failed = 0;

// The CLI's flag parser treats a positional arg starting with "--" as a flag,
// so strip leading comment lines (blank lines between runs included) before
// execution (interior comments stay).
const stripLeadingComments = (s) => {
  let t = s.trim();
  while (t.startsWith('--')) {
    const nl = t.indexOf('\n');
    if (nl === -1) return ''; // comment-only statement
    t = t.slice(nl + 1).trim();
  }
  return t;
};

for (let i = 0; i < statements.length; i++) {
  const firstLine = statements[i].split('\n')[0].slice(0, 70);
  process.stdout.write(`[${i + 1}/${statements.length}] ${firstLine} ... `);
  try {
    execFileSync(supabase, ['db', 'query', '--db-url', dbUrl, stripLeadingComments(statements[i])], {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 120000,
    });
    console.log('OK');
  } catch (err) {
    failed++;
    console.log('FAILED');
    console.error(String(err.stderr || err.message).trim().slice(0, 500));
  }
}

console.log(
  failed === 0
    ? `\nAll ${statements.length} statements applied.`
    : `\n${failed} of ${statements.length} failed — check output above.`,
);
process.exit(failed === 0 ? 0 : 1);
