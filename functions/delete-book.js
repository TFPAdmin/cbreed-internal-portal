export async function onRequestPost(context) {
  try {
    const { id } = await context.request.json();
    const { DB } = context.env;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing book ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await DB.prepare("DELETE FROM books WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Delete error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
