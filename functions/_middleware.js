export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  // Allow access to login and auth route
  if (
    path === "/admin/login.html" ||
    path === "/login"
  ) {
    return await context.next();
  }

  // Allow only if auth cookie is present
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // Redirect to login
  return Response.redirect(`${url.origin}/admin/login.html`, 302);
}
