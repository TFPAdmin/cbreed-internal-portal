export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  // Always allow access to login endpoint and page
  if (path === "/admin/login.html" || path === "/login") {
    return await context.next();
  }

  // If authenticated, allow access
  if (cookie.includes("auth=1")) {
    return await context.next();
  }

  // Redirect to login and pass original path as ?redirect=
  return Response.redirect(`${url.origin}/admin/login.html?redirect=${encodeURIComponent(path)}`, 302);
}
