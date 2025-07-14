export async function onRequest({ request, env }) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== "number") {
      return new Response("Invalid or missing chapter ID", { status: 400 });
    }

    const stmt = env.DB.prepare("DELETE FROM chapters WHERE id = ?");
    await stmt.bind(id).run();

    return new Response("Chapter deleted", { status: 200 });

  } catch (err) {
    console.error("Failed to delete chapter:", err);
    return new Response("Failed to delete chapter", { status: 500 });
  }
}
