const express = require('express');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin/firestore');

const router = express.Router();

// Existing send message (updated for replyToId)
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content, replyToId } = req.body;
    if (!senderId || !receiverId || !content)
      return res.status(400).json({ error: 'Missing fields' });

    const convoId = [senderId, receiverId].sort().join('_');

    const message = {
      senderId,
      content,
      timestamp: new Date().toISOString(),
      replyToId: replyToId || null, // Optional reply
    };

    await db
      .collection('conversations')
      .doc(convoId)
      .collection('messages')
      .add(message);

    res.status(200).json({ message: 'Message sent', message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message: ' + error.message });
  }
});

// Existing get messages (no change needed)

// Group chat creation
router.post('/groups/create', async (req, res) => {
  try {
    const { creatorId, groupName, userIds } = req.body;
    if (!creatorId || !groupName || !userIds || !Array.isArray(userIds))
      return res.status(400).json({ error: 'Missing fields' });

    const groupId = db.collection('groups').doc().id;
    const group = {
      name: groupName,
      creatorId,
      members: [creatorId, ...userIds],
      createdAt: new Date().toISOString(),
    };

    await db.collection('groups').doc(groupId).set(group);

    res.status(201).json({ message: 'Group created', groupId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create group: ' + error.message });
  }
});

// Add user to group
router.put('/groups/:groupId/add', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const groupRef = db.collection('groups').doc(groupId);
    await groupRef.update({
      members: FieldValue.arrayUnion(userId),
    });

    res.json({ message: 'User added to group' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user: ' + error.message });
  }
});

// Remove user from group
router.put('/groups/:groupId/remove', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const groupRef = db.collection('groups').doc(groupId);
    await groupRef.update({
      members: FieldValue.arrayRemove(userId),
    });

    res.json({ message: 'User removed from group' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove user: ' + error.message });
  }
});

// Send message to group
router.post('/groups/:groupId/send', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { senderId, content, replyToId } = req.body;
    if (!senderId || !content)
      return res.status(400).json({ error: 'Missing fields' });

    const message = {
      senderId,
      content,
      timestamp: new Date().toISOString(),
      replyToId: replyToId || null,
    };

    await db
      .collection('groups')
      .doc(groupId)
      .collection('messages')
      .add(message);

    res.status(200).json({ message: 'Group message sent', message });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Failed to send group message: ' + error.message });
  }
});

// Get group messages
router.get('/groups/:groupId/messages', async (req, res) => {
  try {
    const { groupId } = req.params;

    const snapshot = await db
      .collection('groups')
      .doc(groupId)
      .collection('messages')
      .orderBy('timestamp')
      .get();

    const messages = snapshot.docs.map((doc) => doc.data());

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Failed to fetch group messages: ' + error.message });
  }
});

module.exports = router;
