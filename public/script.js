document.addEventListener("DOMContentLoaded", () => {
  const bookList = document.getElementById("books");
  const bookForm = document.getElementById("book-form");

  // Load books on page load
  async function loadBooks() {
    bookList.innerHTML = "<li>Loading books...</li>";
    try {
      const res = await fetch("/api/get-books");
      const books = await res.json();
      bookList.innerHTML = "";

      books.forEach(book => {
        const li = document.createElement("li");
        li.className = "book-card";

        li.innerHTML = `
          <img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'">
          <h3>${book.title}</h3>
          <p><em>${book.subtitle || ""}</em></p>
          <p>${book.excerpt || ""}</p>
          <a href="${book.wattpad}" target="_blank">Read on Wattpad</a><br>
          <button onclick="editBook('${book.id}')">✏️ Edit</button>
          <button onclick="removeBook('${book.id}')">🗑️ Remove</button>
        `;
        bookList.appendChild(li);
      });
    } catch (err) {
      bookList.innerHTML = "<li>Error loading books</li>";
    }
  }

  // Add new book
  bookForm.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(bookForm);
    const newBook = {
      id: crypto.randomUUID(),
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      excerpt: formData.get("excerpt"),
      cover: formData.get("cover"),
      wattpad: formData.get("wattpad")
    };

    await fetch("/api/add-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook)
    });

    bookForm.reset();
    loadBooks();
  });

  // Placeholder for edit
  window.editBook = (id) => {
    alert(`Edit feature for book ID ${id} coming soon.`);
  };

  // Remove a book
  window.removeBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    await fetch(`/api/remove-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    loadBooks();
  };

  loadBooks();
});
