const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

let tasks = [];

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { id, text } = req.body;
  if (typeof id !== 'number' || !text) {
    return res.status(400).json({ error: 'Invalid task data' });
  }
  const task = { id, text, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.completed = Boolean(completed);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
