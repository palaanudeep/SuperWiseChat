import React, { useEffect, useState } from 'https://cdn.skypack.dev/react';
import Chat from './components/Chat.js';
import Login from './components/Login.js';

export default function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (info) => {
    setUser(info);
  };
  return (
    <div>
      {user ? <Chat user={user} /> : <Login onLogin={handleLogin} />}
    </div>
  );
}
