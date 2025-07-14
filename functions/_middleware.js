export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const cookie = request.headers.get("Cookie") || "";

  const allowPaths = [
    "/admin/login.html",
    "/admin/login",
    "/login",
    "/favicon.ico",
    "/admin/",       // for when someone visits /admin/
    "/admin"         // for when someone visits /admin with no slash
  ];

  // ✅ Allow login-related paths
  if (allowPaths.includes(path)) {
    return await next();
  }

  // ✅ Allow if cookie is valid
  if (cookie.includes("auth=1")) {
    return await next();
  }

  // ❌ Otherwise redirect to login
  return Response.redirect(`${url.origin}/admin/login.html`, 302);
}
