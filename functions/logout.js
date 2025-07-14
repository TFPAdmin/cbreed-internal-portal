export async function onRequest() {
  const headers = new Headers();
  headers.set("Set-Cookie", "auth=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");

  return new Response("Logged out", {
    status: 200,
    headers
  });
}
