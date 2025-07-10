export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { book_title } = await context.request.json();

    if (!book_title) {
      return new Response("Missing book title", { status: 400 });
    }

    // Fetch chapters to build excerpt
    const { results: chapters } = await DB.prepare(`
      SELECT chapter_number, chapter_title, content
      FROM chapters
      WHERE book_title = ?
      ORDER BY chapter_number ASC
    `).bind(book_title).all();

    if (!chapters || chapters.length === 0) {
      return new Response("No chapters found to publish", { status: 404 });
    }

    const excerpt = chapters.map(ch =>
      `Chapter ${ch.chapter_number}: ${ch.chapter_title || ""}\n${ch.content}\n\n`
    ).join("");

    // Get WIP book details
    const wipBook = await DB.prepare(`
      SELECT id, subtitle, cover, wattpad, created_at
      FROM wip_books
      WHERE title = ?
      LIMIT 1
    `).bind(book_title).first();

    if (!wipBook) {
      return new Response("WIP book not found", { status: 404 });
    }

    // Insert into published books
    await DB.prepare(`
      INSERT INTO books (id, title, subtitle, excerpt, cover, wattpad, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      wipBook.id,
      book_title,
      wipBook.subtitle,
      excerpt,
      wipBook.cover,
      wipBook.wattpad,
      wipBook.created_at || new Date().toISOString()
    ).run();

    // Delete from WIP
    await DB.prepare(`
      DELETE FROM wip_books WHERE id = ?
    `).bind(wipBook.id).run();

    return new Response("Book published successfully", { status: 200 });
  } catch (err) {
    console.error("Publish Book Error:", err);
    return new Response("Failed to publish book", { status: 500 });
  }
}
