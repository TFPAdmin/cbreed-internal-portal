// functions/login.js
export async function onRequest(context) {
  const { request, env } = context;

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response("Missing credentials", { status: 400 });
    }

    const stmt = env.DB.prepare("SELECT value FROM admin_settings WHERE key = ?");
    const result = await stmt.bind(username).first();

    if (!result) {
      return new Response("User not found", { status: 401 });
    }

    const storedPassword = result.value;

    if (storedPassword === password) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `auth_user=${username}; Path=/; HttpOnly; SameSite=Strict`,
        },
      });
    } else {
      return new Response("Incorrect password", { status: 401 });
    }

  } catch (err) {
    console.error("Login error:", err);
    return new Response("Server error", { status: 500 });
  }
}
