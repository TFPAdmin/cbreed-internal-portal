export async function onRequestPost(context) {
  const { id, title, subtitle, excerpt, cover, wattpad } = await context.request.json();
  const { DB } = context.env;

  if (!id || !title) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  await DB.prepare(`
    UPDATE books
    SET title = ?, subtitle = ?, excerpt = ?, cover = ?, wattpad = ?
    WHERE id = ?
  `).bind(title, subtitle, excerpt, cover, wattpad, id).run();

  return new Response(JSON.stringify({ success: true }));
}

export async function onRequestGet(context) {
  const { DB } = context.env;
  const results = await DB.prepare("SELECT * FROM books ORDER BY id DESC").all();
  return new Response(JSON.stringify(results.results));
}
