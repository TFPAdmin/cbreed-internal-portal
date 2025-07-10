document.addEventListener("DOMContentLoaded", () => {
  const wipList = document.getElementById("wip-books");
  const publishedList = document.getElementById("published-books");
  const bookForm = document.getElementById("book-form");

  let editingId = null;
  let editingStatus = null;

  async function loadBooks() {
    wipList.innerHTML = "<li>Loading WIP books...</li>";
    publishedList.innerHTML = "<li>Loading published books...</li>";
    try {
      const res = await fetch("/get-books");
      const books = await res.json();
      wipList.innerHTML = "";
      publishedList.innerHTML = "";

      books.forEach(book => {
        const li = document.createElement("li");
        li.className = "book-card";
        li.innerHTML = `
          <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'">
          <h3>${book.title}</h3>
          <p><em>${book.subtitle || ""}</em></p>
          <p>${book.excerpt || ""}</p>
          <a href="${book.wattpad}" target="_blank">Read on Wattpad</a><br>
          <button onclick="editBook('${book.id}', '${book.status}')">✏️ Edit</button>
          <button onclick="removeBook('${book.id}', '${book.status}')">🗑️ Remove</button>
        `;
        if (book.status === "wip") {
          wipList.appendChild(li);
        } else if (book.status === "published") {
          publishedList.appendChild(li);
        }
      });
    } catch (err) {
      console.error("Load error:", err);
      wipList.innerHTML = "<li>Error loading WIP books</li>";
      publishedList.innerHTML = "<li>Error loading published books</li>";
    }
  }

  bookForm.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(bookForm);
    const action = document.getElementById("action").value;

    const bookData = {
      id: editingId || crypto.randomUUID(),
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      excerpt: formData.get("excerpt"),
      cover: formData.get("cover"),
      wattpad: formData.get("wattpad")
    };

    if (editingId) {
      // UPDATE existing book
      await fetch("/api/update-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
      });
    } else if (action === "create") {
      // ADD new to WIP
      await fetch("/api/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
      });
    }

    editingId = null;
    editingStatus = null;
    bookForm.reset();
    await loadBooks();
  });

  window.editBook = async (id, status) => {
    try {
      const res = await fetch("/get-books");
      const books = await res.json();
      const book = books.find(b => b.id === id && b.status === status);
      if (!book) return alert("Book not found.");

      editingId = book.id;
      editingStatus = book.status;

      bookForm.querySelector("input[name='title']").value = book.title;
      bookForm.querySelector("input[name='subtitle']").value = book.subtitle || "";
      bookForm.querySelector("textarea[name='excerpt']").value = book.excerpt || "";
      bookForm.querySelector("input[name='cover']").value = book.cover || "";
      bookForm.querySelector("input[name='wattpad']").value = book.wattpad || "";
    } catch (err) {
      console.error("Edit load error:", err);
      alert("Failed to load book for editing.");
    }
  };

  window.removeBook = async (id, status) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    await fetch("/api/remove-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    await loadBooks();
  };

  loadBooks();
});
