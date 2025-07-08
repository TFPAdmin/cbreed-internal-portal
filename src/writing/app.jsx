import { useState, useEffect } from 'react';

export default function App() {
  const [bookTitle, setBookTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    const res = await fetch('/api/save-chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookTitle,
        chapterTitle,
        content,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Chapter saved successfully!');
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div className="editor-container">
      <h1>Writing Portal</h1>

      <input
        className="input"
        placeholder="Book Title"
        value={bookTitle}
        onChange={(e) => setBookTitle(e.target.value)}
      />

      <input
        className="input"
        placeholder="Chapter Title"
        value={chapterTitle}
        onChange={(e) => setChapterTitle(e.target.value)}
      />

      <textarea
        className="textarea"
        placeholder="Write your chapter here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="button" onClick={handleSave}>Save Chapter</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
