export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const bookId = url.searchParams.get("bookId");
  const { DB } = context.env;

  if (!bookId) {
    return new Response(JSON.stringify({ error: "Missing book ID" }), { status: 400 });
  }

  const chapters = await DB.prepare("SELECT * FROM chapters WHERE book_id = ? ORDER BY id DESC")
    .bind(bookId).all();

  return new Response(JSON.stringify(chapters.results));
}
