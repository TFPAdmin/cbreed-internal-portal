export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id } = await context.request.json();

    if (!id) {
      return new Response("Missing ID", { status: 400 });
    }

    await DB.prepare(`
      DELETE FROM brainstorm
      WHERE id = ?
    `).bind(id).run();

    return new Response("Brainstorm note deleted", { status: 200 });
  } catch (err) {
    console.error("Delete Brainstorm Error:", err);
    return new Response("Failed to delete brainstorm note", { status: 500 });
  }
}

