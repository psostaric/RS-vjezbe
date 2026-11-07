const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

// Jednostavna "baza" u memoriji
const tasks = [{ id: 1, text: 'Primjer zadatka', done: false }];
let nextId = 2;

app.get('/', (req, res) => {
  res.send('Express poslužitelj radi.');
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Nije pronađeno.' });
  res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Nije pronađeno.' });
  if (typeof req.body?.text === 'string' && req.body.text.trim()) task.text = req.body.text.trim();
  if (typeof req.body?.done === 'boolean') task.done = req.body.done;
  res.json(task);
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const text = (req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Polje "text" je obavezno.' });
  const task = { id: nextId++, text, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const i = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Nije pronađeno.' });
  tasks.splice(i, 1);
  res.status(204).end();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});
