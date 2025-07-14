export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  // ✅ Allow access to login page and auth route
  if (
    path.startsWith("/admin/login.html") ||
    path.startsWith("/login")
  ) {
    return await context.next();
  }

  // ✅ Check cookie
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // ❌ Not authenticated → redirect to login
  return Response.redirect(`${url.origin}/admin/login.html`, 302);
}
