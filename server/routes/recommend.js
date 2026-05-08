import { Router } from 'express';
import { chat } from '../services/deepseek.js';
import { buildRecommendSystemPrompt } from '../prompts/recommend.js';
import { getMessages, saveRecommendations, updateSession } from '../db.js';

const router = Router();

router.post('/', async (req, res, next) => {
  const { sessionId, profile } = req.body;

  if (!sessionId || !profile) {
    return res.status(400).json({ error: 'sessionId and profile are required' });
  }

  try {
    const history = getMessages(sessionId);
    const systemPrompt = buildRecommendSystemPrompt(profile, history);

    let reply;
    try {
      reply = await chat(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: '请根据以上信息生成行动推荐。' },
        ],
        { temperature: 0.8, maxTokens: 3000 }
      );
    } catch (apiErr) {
      console.error('DeepSeek API error:', apiErr.message);
      return res.status(502).json({ error: 'AI服务暂时不可用', detail: apiErr.message });
    }

    if (!reply || typeof reply !== 'string') {
      return res.status(500).json({ error: 'AI返回了空内容' });
    }

    let data;
    try {
      const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : reply.trim();
      data = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr.message);
      console.error('Raw reply (first 500):', reply.substring(0, 500));
      return res.status(500).json({ error: 'AI返回格式异常，请重试' });
    }

    try {
      saveRecommendations(sessionId, data);
      updateSession(sessionId, { stage: 'recommend' });
    } catch (dbErr) {
      console.error('DB save error:', dbErr.message);
      // Still return the data even if DB save fails
    }

    res.json(data);
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ error: '推荐服务暂时不可用', detail: err.message });
  }
});

export default router;
