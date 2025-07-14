export async function onRequest({ request, env }) {
  try {
    const url = new URL(request.url);
    const bookTitle = url.searchParams.get("book_title");

    const stmt = env.DB.prepare(`
      SELECT * FROM chapters
      WHERE book_title = ?
      ORDER BY chapter_number ASC
    `);
    const chapters = await stmt.bind(bookTitle).all();
    return Response.json(chapters.results);
  } catch (err) {
    return new Response("Failed to get chapters", { status: 500 });
  }
}
