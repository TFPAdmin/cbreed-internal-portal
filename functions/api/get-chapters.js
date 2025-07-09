export async function onRequestGet(context) {
  try {
    const DB = context.env.DB;
    const url = new URL(context.request.url);
    const book_title = url.searchParams.get("book_title");

    if (!book_title) {
      return new Response("Missing book_title parameter", { status: 400 });
    }

    const { results } = await DB.prepare(`
      SELECT id, chapter_number, chapter_title, content, created_at
      FROM chapters
      WHERE book_title = ?
      ORDER BY chapter_number ASC
    `).bind(book_title).all();

    return Response.json(results);
  } catch (err) {
    console.error("Get Chapters Error:", err);
    return new Response("Failed to fetch chapters", { status: 500 });
  }
}
