// functions/add-wip-book.js
export async function onRequest({ request, env }) {
  try {
    const data = await request.json();
    const { title, subtitle, excerpt, cover, wattpad } = data;

    await env.DB.prepare(`
      INSERT INTO books (title, subtitle, excerpt, cover, wattpad, published)
      VALUES (?, ?, ?, ?, ?, 0)
    `).bind(title, subtitle, excerpt, cover, wattpad).run();

    return new Response("WIP book added", { status: 200 });
  } catch (err) {
    console.error("Error adding WIP book:", err);
    return new Response("Failed to add WIP book", { status: 500 });
  }
}

// functions/get-wip-books.js
export async function onRequest({ env }) {
  try {
    const result = await env.DB.prepare("SELECT * FROM books WHERE published = 0").all();
    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching WIP books:", err);
    return new Response("Failed to fetch WIP books", { status: 500 });
  }
}

// functions/publish-book.js
export async function onRequest({ request, env }) {
  try {
    const { id } = await request.json();
    await env.DB.prepare("UPDATE books SET published = 1 WHERE id = ?").bind(id).run();
    return new Response("Book published", { status: 200 });
  } catch (err) {
    console.error("Error publishing book:", err);
    return new Response("Failed to publish book", { status: 500 });
  }
}
