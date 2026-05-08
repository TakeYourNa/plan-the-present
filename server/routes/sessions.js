import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getSession, getMessages, getRecommendations } from '../db.js';

const router = Router();

router.post('/', (req, res) => {
  const id = uuidv4();
  const profile = req.body.profile || {};
  createSession(id, profile);
  res.json({ sessionId: id });
});

router.get('/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const messages = getMessages(req.params.id);
  const recommendations = getRecommendations(req.params.id);

  res.json({
    ...session,
    profile: JSON.parse(session.profile),
    messages,
    recommendations,
  });
});

export default router;
