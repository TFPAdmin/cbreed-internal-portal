export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id } = await context.request.json();

    if (!id) {
      return new Response("Missing ID", { status: 400 });
    }

    await DB.prepare(`
      DELETE FROM books
      WHERE id = ?
    `).bind(id).run();

    return new Response("Book deleted", { status: 200 });
  } catch (err) {
    console.error("Remove Book Error:", err);
    return new Response("Failed to delete book", { status: 500 });
  }
}
