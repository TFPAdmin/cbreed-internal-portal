export async function onRequest({ request, env }) {
  try {
    const { username } = await request.json();
    if (!username) {
      return new Response("Missing username", { status: 400 });
    }

    const result = await env.DB.prepare("DELETE FROM admin_settings WHERE key = ?")
      .bind(username)
      .run();

    if (result.success) {
      return new Response("User deleted", { status: 200 });
    } else {
      return new Response("Failed to delete user", { status: 500 });
    }
  } catch (err) {
    return new Response("Error deleting user", { status: 500 });
  }
}
