// pages/add-product.js
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function AddProduct() {
  const { data: session, status } = useSession();
  const [catalogReference, setCatalogReference] = useState('');
  const [message, setMessage] = useState('');

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>You must be logged in to add products.</p>
        <button onClick={() => signIn()}>Login</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Loading...');
    try {
      const response = await fetch('/api/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catalogReference }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Product ${catalogReference} added successfully.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Catalog Reference:
          <input
            type="text"
            value={catalogReference}
            onChange={(e) => setCatalogReference(e.target.value)}
          />
        </label>
        <button type="submit">Add Product</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
