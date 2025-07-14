export async function onRequest({ request, env }) {
  try {
    const { id } = await request.json();

    const stmt = env.DB.prepare("DELETE FROM chapters WHERE id = ?");
    await stmt.bind(id).run();

    return new Response("Chapter deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to delete chapter", { status: 500 });
  }
}
