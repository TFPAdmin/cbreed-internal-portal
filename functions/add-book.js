export async function onRequestPost(context) {
  try {
    const DB = context.env.DB; // Your bound D1 database
    const data = await context.request.json();

    const { id, title, subtitle, excerpt, cover, wattpad } = data;

    if (!id || !title) {
      return new Response("Missing required fields", { status: 400 });
    }

    await DB.prepare(`
      INSERT INTO books (id, title, subtitle, excerpt, cover, wattpad)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, title, subtitle, excerpt, cover, wattpad).run();

    return new Response("Book added successfully", { status: 200 });
  } catch (err) {
    console.error("Add Book Error:", err);
    return new Response("Failed to add book", { status: 500 });
  }
}
