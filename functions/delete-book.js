export async function onRequest({ request, env }) {
  try {
    const { id } = await request.json();
    const stmt = env.DB.prepare("DELETE FROM books WHERE id = ?");
    await stmt.bind(id).run();
    return new Response("Book deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to delete book", { status: 500 });
  }
}
