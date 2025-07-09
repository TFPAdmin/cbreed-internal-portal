export async function onRequestPost(context) {
  const { id, title, subtitle, excerpt, cover, wattpad } = await context.request.json();
  const db = context.env.DB;

  if (!id || !title) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await db
      .prepare(
        `INSERT INTO books (id, title, subtitle, excerpt, cover, wattpad)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(id, title, subtitle, excerpt, cover, wattpad)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error inserting book:", e);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
