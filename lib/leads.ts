/**
 * Pre-order leads (email + phone) in Neon Postgres.
 * You text people from this list when the drop opens — no automated SMS.
 */
import "server-only";

import { neon } from "@neondatabase/serverless";

export type PreorderLead = {
  email: string;
  phone?: string;
  size?: string;
  source?: string;
  consent?: boolean;
  at: string;
};

function getSql() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) return null;
  return neon(url);
}

let tableReady: Promise<void> | null = null;

async function ensureTable() {
  const sql = getSql();
  if (!sql) return;
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS preorder_leads (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL,
          phone TEXT,
          size TEXT,
          source TEXT,
          consent BOOLEAN,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS preorder_leads_created_at_idx
        ON preorder_leads (created_at DESC)
      `;
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  await tableReady;
}

export async function savePreorderLead(lead: PreorderLead): Promise<boolean> {
  const sql = getSql();
  if (!sql) {
    console.info("[leads] skipped — DATABASE_URL not set");
    return false;
  }

  await ensureTable();
  await sql`
    INSERT INTO preorder_leads (email, phone, size, source, consent, created_at)
    VALUES (
      ${lead.email},
      ${lead.phone ?? null},
      ${lead.size ?? null},
      ${lead.source ?? null},
      ${lead.consent ?? null},
      ${lead.at}
    )
  `;
  return true;
}

export async function listPreorderLeads(limit = 5000): Promise<
  {
    id: number;
    email: string;
    phone: string | null;
    size: string | null;
    source: string | null;
    consent: boolean | null;
    created_at: string;
  }[]
> {
  const sql = getSql();
  if (!sql) return [];
  await ensureTable();
  const capped = Math.min(Math.max(1, limit), 10000);
  const rows = await sql`
    SELECT id, email, phone, size, source, consent, created_at
    FROM preorder_leads
    ORDER BY created_at DESC
    LIMIT ${capped}
  `;
  return rows as {
    id: number;
    email: string;
    phone: string | null;
    size: string | null;
    source: string | null;
    consent: boolean | null;
    created_at: string;
  }[];
}
