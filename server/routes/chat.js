import { Router } from 'express';
import { chat } from '../services/deepseek.js';
import { buildDialogueSystemPrompt } from '../prompts/dialogue.js';
import { addMessage, getMessages, updateSession } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { sessionId, profile, userMessage } = req.body;

  if (!sessionId || !profile) {
    return res.status(400).json({ error: 'sessionId and profile are required' });
  }

  try {
    const history = getMessages(sessionId);
    const systemPrompt = buildDialogueSystemPrompt(profile);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
    ];

    if (userMessage) {
      messages.push({ role: 'user', content: userMessage });
      addMessage(sessionId, 'user', userMessage);
    } else if (history.length === 0) {
      messages.push({ role: 'user', content: '你好，我准备好开始这段对话了。' });
    }

    const reply = await chat(messages);
    addMessage(sessionId, 'assistant', reply);
    updateSession(sessionId, { stage: 'dialogue' });

    res.json({ reply, roundCount: Math.ceil(history.length / 2) + 1 });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: '对话服务暂时不可用', detail: err.message });
  }
});

export default router;
