export async function onRequestPost(context) {
  const { DB } = context.env;
  const { bookTitle, chapterTitle, content } = await context.request.json();

  if (!bookTitle || !chapterTitle || !content) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  // Get or create book ID
  const existing = await DB.prepare("SELECT id FROM books WHERE title = ?")
    .bind(bookTitle).first();

  let bookId = existing?.id;
  if (!bookId) {
    const insert = await DB.prepare("INSERT INTO books (title) VALUES (?) RETURNING id")
      .bind(bookTitle).first();
    bookId = insert.id;
  }

  await DB.prepare(
    "INSERT INTO chapters (book_id, title, content) VALUES (?, ?, ?)"
  ).bind(bookId, chapterTitle, content).run();

  return new Response(JSON.stringify({ success: true }));
}
