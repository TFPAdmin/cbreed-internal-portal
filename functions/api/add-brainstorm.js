export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();
    const { id, text } = data;

    if (!id || !text) {
      return new Response("Missing id or text", { status: 400 });
    }

    await DB.prepare(
      `INSERT INTO brainstorm (id, text) VALUES (?, ?)`
    ).bind(id, text).run();

    return new Response("Idea added successfully", { status: 200 });
  } catch (err) {
    console.error("Add Brainstorm Error:", err);
    return new Response("Failed to add idea", { status: 500 });
  }
}
