const DATA_KEY = "catalog";
const MAX_BODY_BYTES = 24 * 1024 * 1024;

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

function decodeDataUrl(value) {
  const match = /^data:([^;,]+);base64,(.+)$/i.exec(value || "");
  if (!match) return null;
  const mimeType = match[1].toLowerCase();
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return { mimeType, bytes };
}

function extensionForMime(mimeType) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}

async function storeProductImages(products, env) {
  if (!env.IMAGES) return products;

  return Promise.all(
    products.map(async (product) => {
      if (!String(product.image || "").startsWith("data:")) return product;
      const decoded = decodeDataUrl(product.image);
      if (!decoded) return { ...product, image: "" };
      const key = `products/${product.id}-${Date.now()}.${extensionForMime(decoded.mimeType)}`;
      await env.IMAGES.put(key, decoded.bytes, {
        httpMetadata: { contentType: decoded.mimeType },
      });
      return { ...product, image: `/api/images/${key}` };
    })
  );
}

// This route must stay protected by Cloudflare Access at /api/admin*.
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

export async function onRequestPut({ env, request }) {
  if (!env.DB) {
    return jsonResponse({ error: "Banco de dados ainda não configurado." }, 501);
  }

  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Catálogo muito grande para salvar de uma vez." }, 413);
  }

  const data = JSON.parse(body || "{}");
  if (!Array.isArray(data.products)) {
    return jsonResponse({ error: "Produtos inválidos." }, 400);
  }
  if (!env.IMAGES && data.products.some((product) => String(product.image || "").startsWith("data:"))) {
    return jsonResponse({ error: "Armazenamento de imagens IMAGES ainda não configurado." }, 501);
  }

  await ensureSchema(env.DB);
  const products = await storeProductImages(data.products, env);
  const payload = {
    products,
    settings: data.settings || {},
    updatedAt: new Date().toISOString(),
  };

  await env.DB
    .prepare("INSERT OR REPLACE INTO app_data (key, value, updated_at) VALUES (?, ?, ?)")
    .bind(DATA_KEY, JSON.stringify(payload), payload.updatedAt)
    .run();

  return jsonResponse({ ok: true, ...payload });
}
