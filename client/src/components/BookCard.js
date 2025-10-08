import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookCard({ book, user, onRequest, onDelete }) {
  const navigate = useNavigate();

  const handleRequest = async () => {
    if (!user) {
      alert('Please log in to request a book.');
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/requests', 
        { bookId: book._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      onRequest();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to request book. Please try again.');
    }
  };

  const handleDelete = () => {
    if (!user) {
      alert('Please log in to delete a book.');
      navigate('/login');
      return;
    }
    onDelete(book._id);
  };

  return (
    <div className="book-card">
      {book.image && <img src={book.image} alt={book.title} />}
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Condition: {book.condition}</p>
      <p>Posted by: {book.user.username}</p>
      {user && user.id !== book.user._id && (
        <button className="button" onClick={handleRequest}>Request Book</button>
      )}
      {user && user.id === book.user._id && (
        <button className="button" onClick={handleDelete}>Delete</button>
      )}
    </div>
  );
}

export default BookCard;