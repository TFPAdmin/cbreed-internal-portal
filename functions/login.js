export async function onRequest({ request, env }) {
  try {
    const { username, password } = await request.json();

    const result = await env.DB.prepare("SELECT value FROM admin_settings WHERE key = ?")
      .bind(username)
      .first();

    if (!result || result.value !== password) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response("Login successful", {
      status: 200,
      headers: {
        "Set-Cookie": "auth=1; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax",
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return new Response("Server error", { status: 500 });
  }
}
