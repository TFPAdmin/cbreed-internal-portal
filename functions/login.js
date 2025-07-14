export async function onRequest(context) {
  const { request, env } = context;

  try {
    const { username, password } = await request.json();
    const result = await env.DB.prepare("SELECT value FROM admin_settings WHERE key = ?").bind(username).first();

    if (result && result.value === password) {
      const headers = new Headers({
        "Set-Cookie": `auth=1; Path=/; HttpOnly; Secure; Max-Age=86400`,
        "Content-Type": "application/json"
      });

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response("Unauthorized", { status: 401 });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
}
