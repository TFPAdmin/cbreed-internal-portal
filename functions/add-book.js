export async function onRequest({ request, env }) {
  try {
    const data = await request.json();
    const { title, subtitle, excerpt, cover, wattpad } = data;

    const stmt = env.DB.prepare(`
      INSERT INTO books (title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?)
    `);

    await stmt.bind(title, subtitle, excerpt, cover, wattpad).run();
    return new Response("Book added", { status: 200 });
  } catch (err) {
    return new Response("Failed to add book", { status: 500 });
  }
}
