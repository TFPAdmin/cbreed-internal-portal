export async function onRequestPost(context) {
  const { id, title, subtitle, excerpt, cover, wattpad } = await context.request.json();
  const { DB } = context.env;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing book ID" }), { status: 400 });
  }

  await DB.prepare(`
    UPDATE books SET
      title = ?, subtitle = ?, excerpt = ?, cover = ?, wattpad = ?
    WHERE id = ?
  `).bind(title, subtitle, excerpt, cover, wattpad, id).run();

  return new Response(JSON.stringify({ success: true }));
}
