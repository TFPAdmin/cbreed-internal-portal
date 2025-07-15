export async function onRequest({ request, env }) {
  try {
    const data = await request.json();
    const { title, subtitle, excerpt, cover } = data;

    if (!title) {
      return new Response("Missing title", { status: 400 });
    }

    const stmt = env.DB.prepare(`
      INSERT INTO books (title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, '')
    `);

    await stmt.bind(title, subtitle || '', excerpt || '', cover || '').run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error adding WIP book:", err);
    return new Response("Server error", { status: 500 });
  }
}
