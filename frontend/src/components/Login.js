import React, { useEffect } from 'https://cdn.skypack.dev/react';

export default function Login({ onLogin }) {
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: (response) => {
          fetch('http://localhost:8000/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential })
          })
            .then(res => res.json())
            .then(data => onLogin(data))
            .catch(console.error);
        }
      });
      google.accounts.id.renderButton(
        document.getElementById('signInDiv'),
        { theme: 'outline', size: 'large' }
      );
    }
  }, []);
  return <div id="signInDiv"></div>;
}
