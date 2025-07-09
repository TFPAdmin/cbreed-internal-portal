export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { password } = await context.request.json();

    if (!password) {
      return new Response("Missing password", { status: 400 });
    }

    const result = await DB.prepare(`
      SELECT value FROM admin_settings WHERE key = 'password'
    `).first();

    if (!result || password !== result.value) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Password check error:", err);
    return new Response("Server error", { status: 500 });
  }
}
