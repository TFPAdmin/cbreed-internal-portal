export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { book_title } = await context.request.json();

    if (!book_title) {
      return new Response("Missing book title", { status: 400 });
    }

    // Fetch chapters for the given book
    const { results: chapters } = await DB.prepare(`
      SELECT chapter_number, chapter_title, content
      FROM chapters
      WHERE book_title = ?
      ORDER BY chapter_number ASC
    `).bind(book_title).all();

    if (chapters.length === 0) {
      return new Response("No chapters found to publish", { status: 404 });
    }

    // Build excerpt by combining all chapter content
    const excerpt = chapters.map(ch => `Chapter ${ch.chapter_number}: ${ch.chapter_title || ""}\n${ch.content}\n\n`).join("");

    // Create a new book entry
    const id = crypto.randomUUID();
    await DB.prepare(`
      INSERT INTO books (id, title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, book_title, "", excerpt, "", "").run();

    return new Response("Book published successfully", { status: 200 });
  } catch (err) {
    console.error("Publish Book Error:", err);
    return new Response("Failed to publish book", { status: 500 });
  }
}
