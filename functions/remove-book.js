export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id } = await context.request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try deleting from published books
    const published = await DB.prepare(`DELETE FROM books WHERE id = ?`).bind(id).run();

    if (published.meta.changes > 0) {
      return new Response(JSON.stringify({ message: "Book deleted from published" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try deleting from WIP
    const wip = await DB.prepare(`DELETE FROM wip_books WHERE id = ?`).bind(id).run();

    if (wip.meta.changes > 0) {
      return new Response(JSON.stringify({ message: "Book deleted from WIP" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Book not found in any table" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Delete Book Error:", err);
    return new Response(JSON.stringify({ error: "Failed to delete book" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
