export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id } = await context.request.json();

    if (!id) {
      return Response.json({ error: "Missing chapter ID" }, { status: 400 });
    }

    const result = await DB.prepare(`
      DELETE FROM chapters
      WHERE id = ?
    `).bind(id).run();

    if (result.meta.changes === 0) {
      return Response.json({ error: "Chapter not found" }, { status: 404 });
    }

    return Response.json({ message: "Chapter deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Delete Chapter Error:", err);
    return Response.json({ error: "Failed to delete chapter" }, { status: 500 });
  }
}
