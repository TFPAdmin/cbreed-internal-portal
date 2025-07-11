export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id, chapter_number, chapter_title, content } = await context.request.json();

    if (!id || !chapter_number || !content) {
      return new Response("Missing required fields", { status: 400 });
    }

    const result = await DB.prepare(`
      UPDATE chapters
      SET chapter_number = ?, chapter_title = ?, content = ?
      WHERE id = ?
    `).bind(chapter_number, chapter_title, content, id).run();

    if (result.meta.changes === 0) {
      return new Response("Chapter not found", { status: 404 });
    }

    return new Response("Chapter updated", { status: 200 });

  } catch (err) {
    console.error("Update Chapter Error:", err);
    return new Response("Failed to update chapter", { status: 500 });
  }
}
