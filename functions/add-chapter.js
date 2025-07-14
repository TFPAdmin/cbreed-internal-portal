export async function onRequest({ request, env }) {
  try {
    const data = await request.json();
    const { book_title, chapter_number, chapter_title, content } = data;

    const stmt = env.DB.prepare(`
      INSERT INTO chapters (book_title, chapter_number, chapter_title, content, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    await stmt.bind(book_title, chapter_number, chapter_title, content).run();
    return new Response("Chapter added", { status: 200 });
  } catch (err) {
    return new Response("Failed to add chapter", { status: 500 });
  }
}
