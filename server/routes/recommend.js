import { Router } from 'express';
import { chat } from '../services/deepseek.js';
import { buildRecommendSystemPrompt } from '../prompts/recommend.js';
import { getMessages, saveRecommendations, updateSession } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { sessionId, profile } = req.body;

  if (!sessionId || !profile) {
    return res.status(400).json({ error: 'sessionId and profile are required' });
  }

  try {
    const history = getMessages(sessionId);
    const systemPrompt = buildRecommendSystemPrompt(profile, history);

    const reply = await chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: '请根据以上信息生成行动推荐。' },
      ],
      { temperature: 0.8, maxTokens: 3000 }
    );

    const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : reply;
    const data = JSON.parse(jsonStr.trim());

    saveRecommendations(sessionId, data);
    updateSession(sessionId, { stage: 'recommend' });

    res.json(data);
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ error: '推荐服务暂时不可用', detail: err.message });
  }
});

export default router;
