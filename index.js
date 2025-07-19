const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRouter = require('./routes/auth');
const messagesRouter = require('./routes/messages');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from /public

app.use('/auth', authRouter);
app.use('/messages', messagesRouter);

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});