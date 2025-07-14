export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  // Always allow login routes
  if (
    path === "/admin/login.html" ||
    path === "/login"
  ) {
    return await context.next();
  }

  // If authenticated, allow access
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // Prevent redirect loop: if already on login, don't redirect again
  if (path === "/admin/login.html") {
    return await context.next();
  }

  // Redirect to login and include intended path
  return Response.redirect(
    `${url.origin}/admin/login.html?redirect=${encodeURIComponent(path)}`,
    302
  );
}
