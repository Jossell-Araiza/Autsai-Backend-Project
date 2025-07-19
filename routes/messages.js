const express = require('express');
const { db } = require('../config/firebase');

const router = express.Router();

// Send message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) return res.status(400).json({ error: 'Missing fields' });

    // Create unique convo ID (sorted to avoid duplicates)
    const convoId = [senderId, receiverId].sort().join('_');

    const message = {
      senderId,
      content,
      timestamp: new Date().toISOString(),
    };

    await db.collection('conversations').doc(convoId).collection('messages').add(message);

    res.status(200).json({ message: 'Message sent', message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message: ' + error.message });
  }
});

// Get messages between two users
router.get('/conversations/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const convoId = [senderId, receiverId].sort().join('_');

    const snapshot = await db.collection('conversations').doc(convoId).collection('messages')
      .orderBy('timestamp')
      .get();

    const messages = snapshot.docs.map(doc => doc.data());

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages: ' + error.message });
  }
});

module.exports = router;