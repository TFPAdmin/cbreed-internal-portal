export async function onRequestGet(context) {
  const { DB } = context.env;

  const { results } = await DB.prepare(
    "SELECT id, title, subtitle, excerpt, cover, wattpad FROM books ORDER BY id ASC"
  ).all();

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
}
