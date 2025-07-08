export async function onRequestGet(context) {
  const { DB } = context.env;

  const result = await DB.prepare(`
    SELECT book_title, chapter_title, content
    FROM chapters
    ORDER BY book_title, chapter_title
  `).all();

  return Response.json(result.results);
}
