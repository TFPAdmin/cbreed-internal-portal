export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();

    const { id, title, subtitle, excerpt, cover, wattpad } = data;

    if (!id || !title) {
      return new Response("Missing required fields", { status: 400 });
    }

    await DB.prepare(`
      UPDATE books
      SET title = ?, subtitle = ?, excerpt = ?, cover = ?, wattpad = ?
      WHERE id = ?
    `).bind(title, subtitle, excerpt, cover, wattpad, id).run();

    return new Response("Book updated successfully", { status: 200 });
  } catch (err) {
    console.error("Update Book Error:", err);
    return new Response("Failed to update book", { status: 500 });
  }
}
