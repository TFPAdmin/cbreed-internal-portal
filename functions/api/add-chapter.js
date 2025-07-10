export async function onRequestPost(context) {
  try {
    const DB = context.env.DB;
    const data = await context.request.json();

    const { id, book_title, chapter_number, chapter_title = "", content } = data;

    // Validate required fields
    if (!id) return new Response("Missing chapter ID", { status: 400 });
    if (!book_title) return new Response("Missing book title", { status: 400 });
    if (typeof chapter_number !== "number") return new Response("Invalid chapter number", { status: 400 });
    if (!content) return new Response("Missing chapter content", { status: 400 });

    // Insert into chapters table
    await DB.prepare(`
      INSERT INTO chapters (id, book_title, chapter_number, chapter_title, content)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, book_title, chapter_number, chapter_title, content).run();

    return Response.json({ message: "Chapter added successfully" }, { status: 200 });
  } catch (err) {
    console.error("Add Chapter Error:", err);
    return new Response("Failed to add chapter", { status: 500 });
  }
}
