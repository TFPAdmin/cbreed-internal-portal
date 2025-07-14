export async function onRequest(context) {
  const { request } = context;

  const url = new URL(request.url);
  const cookie = request.headers.get("Cookie") || "";

  // Bypass protection for the login page
  if (url.pathname === "/admin/login.html" || url.pathname === "/login") {
    return await context.next();
  }

  // Check auth cookie
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // Not authenticated → redirect to login
  return Response.redirect(`${url.origin}/admin/login.html`, 302);
}
