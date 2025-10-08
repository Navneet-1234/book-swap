import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BookForm({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'Good',
    image: ''
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add a book.');
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/books', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      onBookAdded();
      setFormData({ title: '', author: '', condition: 'Good', image: '' });
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Add New Book</h2>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Book Title"
        required
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <select name="condition" value={formData.condition} onChange={handleChange}>
        <option value="Like New">Like New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
      </select>
      <input
        type="text"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL (optional)"
      />
      <button type="submit" className="button">Add Book</button>
    </form>
  );
}

export default BookForm;