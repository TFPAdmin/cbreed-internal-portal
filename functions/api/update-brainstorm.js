export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const { id, topic, note } = await context.request.json();

    if (!id || !note) {
      return new Response("Missing required fields", { status: 400 });
    }

    await DB.prepare(`
      UPDATE brainstorm
      SET topic = ?, note = ?
      WHERE id = ?
    `).bind(topic, note, id).run();

    return new Response("Brainstorm note updated", { status: 200 });
  } catch (err) {
    console.error("Update Brainstorm Error:", err);
    return new Response("Failed to update brainstorm note", { status: 500 });
  }
}
