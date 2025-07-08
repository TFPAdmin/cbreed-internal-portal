// /functions/books.js
export async function onRequest(context) {
  const db = context.env.DB;
  try {
    const { results } = await db.prepare(`SELECT * FROM books ORDER BY id`).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
