export async function onRequestGet({ env, params }) {
  if (!env.IMAGES) {
    return new Response("Image storage not configured.", { status: 501 });
  }

  const key = Array.isArray(params.path) ? params.path.join("/") : params.path;
  if (!key) {
    return new Response("Image key is required.", { status: 400 });
  }

  const object = await env.IMAGES.get(key);
  if (!object) {
    return new Response("Image not found.", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
