import { useState } from 'react';

export default function Archive() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleArchive = async () => {
    try {
      const response = await fetch('/api/archive', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error details from the API
        throw new Error(errorData.error + (errorData.details ? `: ${errorData.details}` : '')); // Include details
      }

      const data = await response.json();
      setMessage(data.message + `. Archive name: ${data.archiveName}`);
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
      console.error("Archive error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleArchive}>Archive Files</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}