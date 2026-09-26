import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Data browser" }

const SUMMARY = [
  { k: "Where", v: "Database page → Data tab" },
  { k: "Can do", v: "View/edit/delete rows, table structure, queries, CSV, SQL export/import" },
  { k: "Limits", v: "500 rows, 15 seconds, 60 queries/min, 50-entry history" },
]

const LAYOUT = [
  { s: "left", d: "list of tables (or Redis keys) + an approximate row count" },
  { s: "top right", d: "row grid, 50 per page, click a header to sort, Structure tab" },
  { s: "bottom right", d: "query box — Ctrl+Enter to run, History tab" },
  { s: "toolbar", d: "pick a database, reload, Export CSV/SQL, Import SQL" },
]

const NEXT = [
  { title: "Managed database", description: "Extra databases on the same server.", href: "/en/docs/database#database-tambahan" },
  { title: "Backup & restore", description: "For routine copies, not manual exports.", href: "/en/docs/backup#database" },
  { title: "Users & roles", description: "Who's allowed to write.", href: "/en/docs/pengguna-peran" },
  { title: "Environment variables", description: "Referencing a database from an application.", href: "/en/docs/environment#referensi" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/data-browser"
      title="Data browser"
      lang="en"
      description="Browse table contents, run queries, and export/import SQL directly from the dashboard — no extra database client needed."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="tata-letak">Layout</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {LAYOUT.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        For servers with{" "}
        <DocLink href="/en/docs/database#database-tambahan">more than one database</DocLink>,
        the <strong>Database</strong> select in the toolbar picks which one is
        shown; owners/admins can create a new database from there (the{" "}
        <em>Create database</em> button).
      </P>

      <H2 id="query">Running queries</H2>
      <Table
        head={["Engine", "What runs", "Example"]}
        rows={[
          ["PostgreSQL", <>A single SQL statement via <Code>psql</Code></>, <Code key="p">SELECT id, email FROM users ORDER BY id DESC</Code>],
          ["MySQL / MariaDB", <>A single SQL statement via <Code>mysql</Code></>, <Code key="m">SHOW CREATE TABLE orders</Code>],
          ["Redis", <>A single command via <Code>redis-cli</Code></>, <Code key="r">HGETALL session:abc</Code>],
        ]}
      />
      <Ul>
        <li>
          Only <strong>one statement</strong> per query — a <Code>;</Code>{" "}
          outside quotes is rejected (400). <Code>--</Code> and{" "}
          <Code>{"/* */"}</Code> comments are stripped first.
        </li>
        <li>
          A <Code>SELECT</Code>/<Code>WITH</Code> without a <Code>LIMIT</Code>{" "}
          gets wrapped in <Code>LIMIT 501</Code>: at most 500 rows are
          displayed, marked as <em>truncated</em>. Add your own{" "}
          <Code>LIMIT</Code>/<Code>OFFSET</Code> to page through more.
        </li>
        <li>
          A <strong>15-second</strong> engine timeout (<Code>statement_timeout</Code> /{" "}
          <Code>max_execution_time</Code> / <Code>max_statement_time</Code>).
        </li>
        <li>
          Results distinguish <Code>NULL</Code> from an empty string;
          non-SELECT statements return the engine&apos;s message, e.g.{" "}
          <Code>UPDATE 3</Code>.
        </li>
        <li>Rate limit: 60 queries per minute per user.</li>
      </Ul>

      <H2 id="edit-baris">Editing & deleting rows, table structure</H2>
      <P>
        The grid isn&apos;t just a viewer — cells can be edited directly, and
        every row has a <strong>Delete</strong> action (owner/admin). The{" "}
        <strong>Structure</strong> tab next to the grid shows a table&apos;s
        columns and indexes without needing <Code>\d</Code> or{" "}
        <Code>SHOW COLUMNS</Code>.
      </P>
      <Ul>
        <li>
          Every write is <strong>validated, not trusted</strong>: the{" "}
          <Code>WHERE</Code> clause must be exactly the table&apos;s primary key —
          no more, no less — and the columns being changed are matched
          against the table&apos;s real columns (not an identifier regex), so a
          column named <Code>first name</Code> still works.
        </li>
        <li>
          Tables <strong>without a primary key</strong> reject edits/deletes
          (400) instead of silently writing to the whole table.
        </li>
        <li>
          After writing, the API confirms <strong>exactly one row</strong>{" "}
          changed — from Postgres&apos;s command tag, or{" "}
          <Code>SELECT ROW_COUNT()</Code> in the same session for MySQL/
          MariaDB. A stale primary key (the row was deleted elsewhere)
          produces a 400, not a false success.
        </li>
        <li>Owner/admin only — members stay read-only, same as queries.</li>
      </Ul>

      <H2 id="hak-tulis">Write access per role</H2>
      <Table
        head={["Role", "Allowed", "Guardrail"]}
        rows={[
          [
            <strong key="m">member</strong>,
            <>Statements starting with <Code>SELECT</Code>, <Code>WITH</Code>, <Code>SHOW</Code>, <Code>EXPLAIN</Code>, <Code>DESCRIBE</Code>, <Code>VALUES</Code>, <Code>TABLE</Code>.</>,
            <>Anything else → 403, <em>and</em> the engine session is put into read-only mode (<Code>default_transaction_read_only</Code> / <Code>SET SESSION TRANSACTION READ ONLY</Code>) — even <Code>WITH … DELETE</Code> fails at the engine.</>,
          ],
          [
            <strong key="oa">owner / admin</strong>,
            "INSERT, UPDATE, DELETE, DDL, plus SQL import and creating databases.",
            "None — use with care; there's no undo.",
          ],
        ]}
      />
      <P>
        Redis: members may only run read commands (<Code>GET</Code>,{" "}
        <Code>MGET</Code>, <Code>HGET*</Code>, <Code>LRANGE</Code>,{" "}
        <Code>SMEMBERS</Code>, <Code>ZRANGE</Code>, <Code>SCAN</Code>, …).
      </P>

      <H2 id="ekspor-impor">CSV export, SQL export & import</H2>
      <Steps>
        <Step title="Export CSV per table (all roles)">
          <P>
            The <strong>Export CSV</strong> button in the grid downloads the
            currently open table as <Code>.csv</Code> — good for
            spreadsheets, unlike a SQL dump which covers the whole database.
          </P>
        </Step>
        <Step title="Export SQL (all roles)">
          <P>
            The <strong>Export SQL</strong> button in the toolbar downloads a
            plain-text dump of the currently selected database (
            <Code>{"<slug>[-db].sql"}</Code>). Handy for moving data
            elsewhere or inspecting the structure.
          </P>
        </Step>
        <Step title="Import SQL (owner/admin)">
          <P>
            The <strong>Import SQL</strong> button accepts a <Code>.sql</Code>{" "}
            file up to <strong>64 MB</strong> and runs it as-is against the
            selected database — after confirmation. The table list reloads
            automatically.
          </P>
        </Step>
      </Steps>
      <Callout kind="warn">
        Imports aren&apos;t wrapped in a transaction and there&apos;s no undo. For
        important data, take a <DocLink href="/en/docs/backup#database">backup</DocLink> first.
        Redis has no CSV/SQL export — use backups instead.
      </Callout>

      <H2 id="riwayat">Query history</H2>
      <P>
        The <strong>History</strong> tab keeps up to the last{" "}
        <strong>50 queries</strong> per user per database — both successful
        and failed, so &quot;what did I just run&quot; is always complete. This is a
        separate table, not part of the instance{" "}
        <DocLink href="/en/docs/pengguna-peran#akun">audit log</DocLink>.
      </P>

      <H2 id="cara-kerja">How it works</H2>
      <P>
        Every query runs in a one-off container from the same engine image
        (the same pattern backups use), with credentials passed via env and
        output written to a file and read back. The API doesn&apos;t bundle any
        database driver.
      </P>
      <Pre>{`psql --csv  ·  mysql --batch  ·  redis-cli --json`}</Pre>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["400: only one statement", <>There&apos;s a trailing <Code>;</Code> or multiple statements. Run them one at a time, or use Import SQL.</>],
          ["403 as a member", "A write statement. Ask an owner/admin, or run it via an application migration (job)."],
          ["Query stops at 15 seconds", "Add an index/WHERE clause, or run it from the application. The timeout can't be raised from the UI."],
          ["Result truncated at 500 rows", "Use LIMIT/OFFSET or export via SQL."],
          ["Import fails partway through", "Earlier statements already ran. Restore a backup, fix the file, and try again."],
          ["400 when editing/deleting a row", "The table has no primary key, or that row already changed/was deleted elsewhere since the grid loaded. Reload and try again."],
        ]}
      />

      <H2 id="berikutnya">Next steps</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
        {NEXT.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 bg-background p-4 transition-colors hover:bg-muted/60"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </span>
            <ArrowRight className="mt-1 size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </DocPage>
  )
}
