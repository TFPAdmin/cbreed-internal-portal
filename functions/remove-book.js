export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id } = await context.request.json();

    if (!id) {
      return new Response("Missing ID", { status: 400 });
    }

    // Try deleting from the published books table
    const bookResult = await DB.prepare(`DELETE FROM books WHERE id = ?`).bind(id).run();

    // If not found there, try deleting from the WIP books table
    if (bookResult.meta.changes === 0) {
      const wipResult = await DB.prepare(`DELETE FROM wip_books WHERE id = ?`).bind(id).run();

      if (wipResult.meta.changes === 0) {
        return new Response("Book not found in any table", { status: 404 });
      }
    }

    return new Response("Book deleted", { status: 200 });
  } catch (err) {
    console.error("Delete Book Error:", err);
    return new Response("Failed to delete book", { status: 500 });
  }
}
