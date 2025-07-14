export async function onRequest({ request, env }) {
  try {
    const { id } = await request.json();

    // Get book title by ID
    const book = await env.DB.prepare("SELECT title FROM books WHERE id = ?")
      .bind(id).first();

    if (!book) return new Response("Book not found", { status: 404 });

    // Delete chapters first
    await env.DB.prepare("DELETE FROM chapters WHERE book_title = ?")
      .bind(book.title).run();

    // Then delete book
    await env.DB.prepare("DELETE FROM books WHERE id = ?")
      .bind(id).run();

    return new Response("Book and chapters deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to delete", { status: 500 });
  }
}
