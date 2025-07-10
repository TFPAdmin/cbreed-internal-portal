export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();

    const { id, title, subtitle, excerpt, cover, wattpad } = data;

    if (!id || !title) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: Check if book already exists
    const existing = await DB.prepare(`SELECT 1 FROM wip_books WHERE id = ?`).bind(id).first();
    if (existing) {
      return Response.json({ error: "Book with this ID already exists" }, { status: 409 });
    }

    await DB.prepare(`
      INSERT INTO wip_books (id, title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, title, subtitle, excerpt, cover, wattpad).run();

    return Response.json({ message: "Book added successfully" }, { status: 200 });

  } catch (err) {
    console.error("Add Book Error:", err);
    return Response.json({ error: "Failed to add book" }, { status: 500 });
  }
}
