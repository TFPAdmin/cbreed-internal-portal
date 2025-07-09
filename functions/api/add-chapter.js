export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();

    const { id, book_title, chapter_number, chapter_title, content } = data;

    if (!id || !book_title || !chapter_number || !content) {
      return new Response("Missing required fields", { status: 400 });
    }

    await DB.prepare(`
      INSERT INTO chapters (id, book_title, chapter_number, chapter_title, content)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, book_title, chapter_number, chapter_title, content).run();

    return new Response("Chapter added", { status: 200 });
  } catch (err) {
    console.error("Add Chapter Error:", err);
    return new Response("Failed to add chapter", { status: 500 });
  }
}

