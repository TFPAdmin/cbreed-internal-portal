export async function onRequest({ env }) {
  try {
    const { results } = await env.DB.prepare(`
      SELECT * FROM books WHERE wattpad IS NULL OR wattpad = ''
    `).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch WIP books:", err);
    return new Response("Server error", { status: 500 });
  }
}
