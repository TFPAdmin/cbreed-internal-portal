export async function onRequest(context) {
  const cookie = context.request.headers.get('Cookie') || '';
  const loggedIn = cookie.includes('auth_user=');

  if (!loggedIn) {
    return new Response("Unauthorized", { status: 401 });
  }

  return await context.next();
}
