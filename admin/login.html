export async function onRequest({ request, env }) {
  try {
    const { username, password } = await request.json();
    const result = await env.DB.prepare("SELECT value FROM admin_settings WHERE key = ?")
      .bind(username).first();

    if (!result || result.value !== password) {
      return new Response("Unauthorized", { status: 401 });
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    // Set secure cookie
    headers.append(
      "Set-Cookie",
      `auth=1; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });

  } catch (err) {
    console.error("Login error:", err);
    return new Response("Server error", { status: 500 });
  }
}
