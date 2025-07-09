export async function onRequestGet(context) {
  try {
    const DB = context.env.DB;

    const { results } = await DB.prepare(`
      SELECT id, title, subtitle, excerpt, cover, wattpad
      FROM books
      ORDER BY title ASC
    `).all();

    return Response.json(results);
  } catch (err) {
    console.error("Get Books Error:", err);
    return new Response("Failed to fetch books", { status: 500 });
  }
}
