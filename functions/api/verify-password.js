export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { password } = await context.request.json();

    if (!password) {
      return new Response("Missing password", { status: 400 });
    }

    const { results } = await DB.prepare(`
      SELECT value FROM admin_settings WHERE key LIKE 'admin_%'
    `).all();

    const match = results.some(row => row.value === password);

    if (!match) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Password check error:", err);
    return new Response("Server error", { status: 500 });
  }
}
