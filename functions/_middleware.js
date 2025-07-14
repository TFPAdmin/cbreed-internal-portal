export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  // Allow access to login-related routes
  if (path === "/admin/login.html" || path === "/login") {
    return await context.next();
  }

  // If cookie is set, allow access
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // Redirect to login with original path
  return Response.redirect(
    `${url.origin}/admin/login.html?redirect=${encodeURIComponent(path)}`,
    302
  );
}
