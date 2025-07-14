export async function onRequest({ request, env }) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    // Check if the user already exists
    const existing = await env.DB.prepare("SELECT * FROM admin_settings WHERE key = ?")
      .bind(username)
      .first();

    if (existing) {
      return new Response("User already exists", { status: 409 });
    }

    // Store username and password as plain text
    await env.DB.prepare("INSERT INTO admin_settings (key, value) VALUES (?, ?)")
      .bind(username, password)
      .run();

    return new Response("User added", { status: 200 });
  } catch (err) {
    return new Response("Failed to add user", { status: 500 });
  }
}
