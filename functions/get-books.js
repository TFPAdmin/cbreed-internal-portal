export async function onRequest({ env }) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM books WHERE published = 1 ORDER BY id DESC");
    const books = await stmt.all();
    return Response.json(books.results);
  } catch (err) {
    return new Response("Failed to get books", { status: 500 });
  }
}
