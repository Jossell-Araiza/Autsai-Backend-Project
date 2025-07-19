const express = require('express');
const { auth } = require('../config/firebase');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const userRecord = await auth.createUser({ email, password });
    const token = await auth.createCustomToken(userRecord.uid);
    res.status(201).json({ uid: userRecord.uid, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    // Firebase Admin doesn't handle password verify; in real app, use client SDK. For this, simulate by getting user and generating token.
    const user = await auth.getUserByEmail(email);
    // Note: Real password check would be on client, but for backend demo, we'll assume creds are sent and generate token if user exists.
    const token = await auth.createCustomToken(user.uid);
    res.json({ uid: user.uid, token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Login failed: ' + error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { uid, displayName } = req.body;
    if (!uid || !displayName) return res.status(400).json({ error: 'Missing fields' });

    await auth.updateUser(uid, { displayName });
    res.json({ message: 'Profile updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile: ' + error.message });
  }
});

// Delete user
router.delete('/delete', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'Missing UID' });

    await auth.deleteUser(uid);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user: ' + error.message });
  }
});

module.exports = router;