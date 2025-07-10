// functions/get-books.js

export async function onRequestGet(context) {
  try {
    const DB = context.env.DB;

    const { results } = await DB.prepare(`
      SELECT id, title, subtitle, excerpt, cover, wattpad, 'published' AS status FROM books
      UNION ALL
      SELECT id, title, subtitle, excerpt, cover, wattpad, 'wip' AS status FROM wip_books
      ORDER BY title ASC
    `).all();

    // Normalize results (just in case)
    const normalizedResults = results.map(book => ({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle || "",
      excerpt: book.excerpt || "",
      cover: book.cover || "",
      wattpad: book.wattpad || "",
      status: book.status?.trim().toLowerCase() === "wip" ? "wip" : "published"
    }));

    return Response.json(normalizedResults);
  } catch (err) {
    console.error("Get Books Error:", err);
    return new Response("Failed to fetch books", { status: 500 });
  }
}
