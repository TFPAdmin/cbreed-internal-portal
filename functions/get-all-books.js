// functions/get-all-books.js
export async function onRequest({ env }) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM books ORDER BY id DESC");
    const books = await stmt.all();
    return Response.json(books.results);
  } catch (err) {
    return new Response("Failed to get all books", { status: 500 });
  }
}
