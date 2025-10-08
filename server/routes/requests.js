const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const request = new Request({
      book: bookId,
      requester: req.user.userId,
      owner: book.user
    });
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-requests', auth, async (req, res) => {
  try {
    const sentRequests = await Request.find({ requester: req.user.userId })
      .populate('book')
      .populate('owner', 'username');
    const receivedRequests = await Request.find({ owner: req.user.userId })
      .populate('book')
      .populate('requester', 'username');
    res.json({ sentRequests, receivedRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.owner.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;