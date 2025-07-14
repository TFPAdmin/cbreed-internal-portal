export async function onRequest({ request, env }) {
  try {
    const { id } = await request.json();
    await env.DB.prepare("DELETE FROM chapters WHERE id = ?").bind(id).run();
    return new Response("Chapter deleted", { status: 200 });
  } catch {
    return new Response("Failed to delete chapter", { status: 500 });
  }
}
