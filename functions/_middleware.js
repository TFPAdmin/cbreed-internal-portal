export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  // Allow login route and static assets
  const allowedPaths = [
    "/login",
    "/admin/login.html",
    "/style.css",
    "/favicon.ico"
  ];

  // Allow any static file in /admin like images, JS, etc.
  if (
    allowedPaths.includes(path) ||
    path.startsWith("/admin/") && !path.endsWith(".html")
  ) {
    return await context.next();
  }

  // Allow authenticated access
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // Redirect unauthenticated users
  return Response.redirect(
    `${url.origin}/admin/login.html?redirect=${encodeURIComponent(path)}`,
    302
  );
}
