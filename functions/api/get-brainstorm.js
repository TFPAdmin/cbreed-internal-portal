export async function onRequestGet(context) {
  try {
    const DB = context.env.DB;

    const { results } = await DB.prepare(`
      SELECT id, topic, note, created_at
      FROM brainstorm
      ORDER BY created_at DESC
    `).all();

    return Response.json(results);
  } catch (err) {
    console.error("Get Brainstorm Error:", err);
    return new Response("Failed to fetch brainstorm notes", { status: 500 });
  }
}
