import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';
import recommendRouter from './routes/recommend.js';
import sessionsRouter from './routes/sessions.js';

// Prevent unhandled promise rejections from killing the process (Node.js v15+)
process.on('unhandledRejection', (reason, _promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v3', time: new Date().toISOString() });
});

app.use('/api/chat', chatRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/sessions', sessionsRouter);

// 404 for unmatched API routes
app.all('/api/{*rest}', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Serve static files in production
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// Express error handler
app.use((err, _req, res, _next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: '服务内部错误', detail: err.message || String(err) });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
