document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("dark-mode-toggle");
  const fontSelect = document.getElementById("font-select");
  const fontSizeSelect = document.getElementById("font-size-select");

  // Apply saved preferences
  const savedTheme = localStorage.getItem("theme");
  const savedFont = localStorage.getItem("font");
  const savedFontSize = localStorage.getItem("fontSize");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkToggle.checked = true;
  }

  if (savedFont) {
    document.body.style.fontFamily = savedFont;
    fontSelect.value = savedFont;
  }

  if (savedFontSize) {
    document.body.style.fontSize = savedFontSize;
    fontSizeSelect.value = savedFontSize;
  }

  // Theme toggle
  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });

  // Font style change
  fontSelect.addEventListener("change", () => {
    const font = fontSelect.value;
    document.body.style.fontFamily = font;
    localStorage.setItem("font", font);
  });

  // Font size change
  fontSizeSelect.addEventListener("change", () => {
    const size = fontSizeSelect.value;
    document.body.style.fontSize = size;
    localStorage.setItem("fontSize", size);
  });
});

// Export chapters or brainstorm data
async function exportData(type) {
  let endpoint = "";
  if (type === "chapters") endpoint = "/api/get-chapters?book_title=All";
  if (type === "brainstorm") endpoint = "/api/get-brainstorm";

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export failed. Check console.");
    console.error("Export Error:", err);
  }
}
