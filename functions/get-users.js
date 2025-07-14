export async function onRequest({ env }) {
  try {
    const { results } = await env.DB.prepare(
      "SELECT key FROM admin_settings"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return new Response("Error", { status: 500 });
  }
}
