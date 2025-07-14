export async function onRequest({ request, env }) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    const result = await env.DB.prepare("UPDATE admin_settings SET value = ? WHERE key = ?")
      .bind(password, username)
      .run();

    if (result.success) {
      return new Response("Password updated", { status: 200 });
    } else {
      return new Response("Failed to update password", { status: 500 });
    }
  } catch (err) {
    return new Response("Error updating password", { status: 500 });
  }
}
