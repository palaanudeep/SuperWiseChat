import React, { useEffect, useState } from 'https://cdn.skypack.dev/react';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/messages')
      .then(res => res.json())
      .then(setMessages);
  }, []);

  const sendMessage = () => {
    fetch('http://localhost:8000/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: user.email, content: text })
    }).then(() => {
      setMessages([...messages, { user: user.email, content: text }]);
      setText('');
    });
  };

  return (
    <div>
      <ul>
        {messages.map((m, i) => (
          <li key={i}><strong>{m.user}</strong>: {m.content}</li>
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
