const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('user', 'username');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, author, condition, image } = req.body;
  try {
    const book = new Book({
      title,
      author,
      condition,
      image,
      user: req.user.userId
    });
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-books', auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;