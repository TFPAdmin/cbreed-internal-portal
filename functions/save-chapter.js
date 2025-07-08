export async function onRequestPost(context) {
  const { bookTitle, chapterTitle, content } = await context.request.json();
  const { DB } = context.env;

  if (!bookTitle || !chapterTitle || !content) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  let book = await DB.prepare("SELECT id FROM books WHERE title = ?")
    .bind(bookTitle).first();

  if (!book) {
    const result = await DB.prepare("INSERT INTO books (title) VALUES (?) RETURNING id")
      .bind(bookTitle).first();
    book = { id: result.id };
  }

  await DB.prepare("INSERT INTO chapters (book_id, title, content) VALUES (?, ?, ?)")
    .bind(book.id, chapterTitle, content).run();

  return new Response(JSON.stringify({ success: true }));
}
