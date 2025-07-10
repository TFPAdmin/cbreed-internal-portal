export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();

    const { id, title, subtitle, excerpt, cover, wattpad } = data;

    if (!id || !title) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try updating published books first
    const result = await DB.prepare(`
      UPDATE books
      SET title = ?, subtitle = ?, excerpt = ?, cover = ?, wattpad = ?
      WHERE id = ?
    `).bind(title, subtitle, excerpt, cover, wattpad, id).run();

    // If not found in books, try updating WIP
    if (result.meta.changes === 0) {
      const wipResult = await DB.prepare(`
        UPDATE wip_books
        SET title = ?, subtitle = ?, excerpt = ?, cover = ?, wattpad = ?
        WHERE id = ?
      `).bind(title, subtitle, excerpt, cover, wattpad, id).run();

      if (wipResult.meta.changes === 0) {
        return new Response(JSON.stringify({ error: "Book not found in any table" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ message: "Book updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Update Book Error:", err);
    return new Response(JSON.stringify({ error: "Failed to update book" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
