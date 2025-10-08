import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.vercel.app/api'; // Update with your backend URL after deployment

function Home() {
  const [books, setBooks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/books`);
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRequest = () => {
    fetchBooks();
  };

  return (
    <div>
      <h1>BookSwap Marketplace</h1>
      <div className="book-grid">
        {books.map(book => (
          <BookCard key={book._id} book={book} user={user} onRequest={handleRequest} apiUrl={API_URL} />
        ))}
      </div>
    </div>
  );
}

export default Home;