import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';
import recommendRouter from './routes/recommend.js';
import sessionsRouter from './routes/sessions.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/sessions', sessionsRouter);

// Serve static files in production
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(distPath, 'index.html'));
  }
});

// Express error handler — MUST be defined to catch async errors in Express 5
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: '服务内部错误', detail: err.message || String(err) });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
