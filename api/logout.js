export async function onRequestGet(context) {
  return new Response("Logged out", {
    headers: {
      "Set-Cookie": "auth_user=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict",
    },
  });
}
