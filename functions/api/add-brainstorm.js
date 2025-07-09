export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();

    const { id, topic, note } = data;

    if (!id || !note) {
      return new Response("Missing required fields", { status: 400 });
    }

    await DB.prepare(`
      INSERT INTO brainstorm (id, topic, note)
      VALUES (?, ?, ?)
    `).bind(id, topic, note).run();

    return new Response("Brainstorm note added", { status: 200 });
  } catch (err) {
    console.error("Add Brainstorm Error:", err);
    return new Response("Failed to add brainstorm note", { status: 500 });
  }
}
