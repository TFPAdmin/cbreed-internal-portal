export async function onRequestPost(context) {
  const { username, password } = await context.request.json();

  // Hardcoded valid user credentials
  const validUsername = 'Corehodo';
  const validPassword = 'Write4Fun62615!';

  if (username !== validUsername || password !== validPassword) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Pretend user ID is 1
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Set-Cookie": `auth_user=1; Path=/; HttpOnly; SameSite=Strict`,
      "Content-Type": "application/json"
    },
  });
}
