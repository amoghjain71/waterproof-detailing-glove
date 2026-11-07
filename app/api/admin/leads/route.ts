import { listPreorderLeads } from "@/lib/leads";
import { clientError } from "@/lib/api-guard";

/**
 * CSV export of pre-order leads for manual outreach.
 * GET /api/admin/leads?key=LEADS_EXPORT_SECRET
 */
export async function GET(request: Request) {
  const secret = process.env.LEADS_EXPORT_SECRET;
  if (!secret) {
    return clientError(503, "Export not configured");
  }

  const key = new URL(request.url).searchParams.get("key");
  if (!key || key !== secret) {
    return clientError(401, "Unauthorized");
  }

  const leads = await listPreorderLeads();
  const header = "id,email,phone,size,source,consent,created_at";
  const lines = leads.map((row) =>
    [
      row.id,
      csv(row.email),
      csv(row.phone ?? ""),
      csv(row.size ?? ""),
      csv(row.source ?? ""),
      row.consent === null || row.consent === undefined ? "" : String(row.consent),
      csv(String(row.created_at)),
    ].join(","),
  );
  const body = [header, ...lines].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="preorder-leads.csv"',
      "Cache-Control": "no-store",
    },
  });
}

function csv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}
