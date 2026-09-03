const DATA_KEY = "catalog";

async function ensureSchema(db) {
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS app_data (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)"
    )
    .run();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return jsonResponse({ configured: false, products: null, settings: null }, 200);
  }

  await ensureSchema(env.DB);
  const row = await env.DB.prepare("SELECT value FROM app_data WHERE key = ?").bind(DATA_KEY).first();
  if (!row) {
    return jsonResponse({ configured: true, products: null, settings: null }, 200);
  }

  return jsonResponse({ configured: true, ...JSON.parse(row.value) });
}
