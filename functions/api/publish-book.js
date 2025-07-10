export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { book_title } = await context.request.json();

    const book = await DB.prepare(`
      SELECT * FROM wip_books WHERE title = ?
    `).bind(book_title).first();

    if (!book) {
      return new Response("Book not found", { status: 404 });
    }

    await DB.prepare(`
      INSERT INTO books (id, title, subtitle, excerpt, cover, wattpad, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      book.id,
      book.title,
      book.subtitle,
      book.excerpt,
      book.cover,
      book.wattpad,
      book.created_at
    ).run();

    await DB.prepare(`
      DELETE FROM wip_books WHERE id = ?
    `).bind(book.id).run();

    return new Response("Book published successfully", { status: 200 });
  } catch (err) {
    console.error("Publish Book Error:", err);
    return new Response("Failed to publish book", { status: 500 });
  }
}
