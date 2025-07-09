export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id } = await context.request.json();

    if (!id) {
      return new Response("Missing ID", { status: 400 });
    }

    await DB.prepare(`
      DELETE FROM chapters
      WHERE id = ?
    `).bind(id).run();

    return new Response("Chapter deleted", { status: 200 });
  } catch (err) {
    console.error("Delete Chapter Error:", err);
    return new Response("Failed to delete chapter", { status: 500 });
  }
}

