import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookForm from '../components/BookForm';
import BookCard from '../components/BookCard';

function MyBooks() {
  const [books, setBooks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books/my-books', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div>
      <h1>My Books</h1>
      <BookForm onBookAdded={fetchBooks} />
      <div className="book-grid">
        {books.map(book => (
          <BookCard key={book._id} book={book} user={user} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default MyBooks;