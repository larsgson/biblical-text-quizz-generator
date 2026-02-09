import type { Context } from "@netlify/edge-functions";

export default async (request: Request, _ctx: Context) => {
  const url = new URL(request.url);
  const backendUrl = Deno.env.get("API_URL");
  const apiKey = Deno.env.get("API_KEY");
  const appPassword = Deno.env.get("APP_PASSWORD");

  // Password-gate endpoints that incur AI API costs
  if (url.pathname === "/api/chat" || url.pathname === "/api/chat-quiz") {
    const provided = request.headers.get("x-app-password");
    if (!appPassword || provided !== appPassword) {
      return new Response(JSON.stringify({ detail: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const target = `${backendUrl}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("x-api-key", apiKey!);
  headers.delete("host");
  headers.delete("x-app-password");

  const response = await fetch(target, {
    method: request.method,
    headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
};
