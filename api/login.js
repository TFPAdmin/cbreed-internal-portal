import { compare } from 'bcryptjs';

export async function onRequestPost(context) {
  const { username, password } = await context.request.json();
  const { DB } = context.env;

  const result = await DB.prepare(
    "SELECT id, password_hash FROM users WHERE username = ?"
  ).bind(username).first();

  if (!result) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  const valid = await compare(password, result.password_hash);
  if (!valid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": `auth_user=${result.id}; Path=/; HttpOnly; SameSite=Strict`,
    },
  });
}
