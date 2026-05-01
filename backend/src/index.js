const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint (used by CI/CD to verify deployment)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
  });
});

// Sample API routes
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: 'Setup GitHub Actions', done: true },
    { id: 2, title: 'Write Dockerfile', done: true },
    { id: 3, title: 'Configure Docker Compose', done: false },
    { id: 4, title: 'Deploy to VPS', done: false },
  ]);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  res.status(201).json({ id: Date.now(), title, done: false });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

module.exports = app;
