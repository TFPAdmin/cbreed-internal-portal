export async function onRequest(context) {
  const cookieHeader = context.request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));

  if (!cookies.auth_user) {
    return Response.redirect("/admin-login.html", 302);
  }

  // If user is authenticated, return the admin page
  const url = new URL(context.request.url);
  const path = url.pathname === "/admin.html" ? "/public/admin.html" : url.pathname;
  return fetch(path, context.request);
}
