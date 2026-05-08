import { useCallback, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { chat } from '../../api/deepseek';
import { buildDialogueSystemPrompt } from '../../prompts/systemDialogue';
import { buildRecommendSystemPrompt } from '../../prompts/systemRecommend';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

export default function DialogueStage() {
  const { profile, messages, addMessage, setStage, setRecommendations, loading, setLoading } = useApp();
  const systemPrompt = useRef(buildDialogueSystemPrompt(profile));
  const dialogueStarted = useRef(false);
  const [roundCount, setRoundCount] = useState(0);
  const [apiError, setApiError] = useState('');

  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const systemMsg = buildRecommendSystemPrompt(profile, messages);
      const response = await chat(
        [
          { role: 'system', content: systemMsg },
          { role: 'user', content: '请根据以上信息生成行动推荐。' },
        ],
        { temperature: 0.8, maxTokens: 3000 }
      );

      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : response;
      const data = JSON.parse(jsonStr);
      setRecommendations(data);
      setStage('recommend');
    } catch (err) {
      console.error('Recommend generation error:', err);
      setApiError('生成推荐时出错，请再试一次。');
    } finally {
      setLoading(false);
    }
  }, [profile, messages, setLoading, setRecommendations, setStage]);

  const startDialogue = useCallback(async () => {
    if (dialogueStarted.current) return;
    dialogueStarted.current = true;
    setLoading(true);
    setApiError('');

    try {
      const response = await chat([
        { role: 'system', content: systemPrompt.current },
        { role: 'user', content: '你好，我准备好开始这段对话了。' },
      ]);
      addMessage('assistant', response);
    } catch (err) {
      console.error('Dialogue start error:', err);
      setApiError('连接 AI 失败，请检查 API Key 是否有效。' +
        (err.message ? ` 错误信息: ${err.message}` : ''));
      dialogueStarted.current = false;
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading]);

  const handleSend = useCallback(async (userInput) => {
    addMessage('user', userInput);
    setRoundCount((c) => c + 1);
    setLoading(true);
    setApiError('');

    try {
      const allMessages = [
        { role: 'system', content: systemPrompt.current },
        ...messages.slice(-10),
        { role: 'user', content: userInput },
      ];

      const response = await chat(allMessages);
      addMessage('assistant', response);
    } catch (err) {
      console.error('Dialogue error:', err);
      setApiError('发送失败，请重试。');
    } finally {
      setLoading(false);
    }
  }, [messages, addMessage, setLoading]);

  return (
    <div className="stage dialogue-stage">
      <header className="stage-header dialogue-header">
        <h2>探索对话</h2>
        <p className="dialogue-subtitle">
          请以最诚实的方式回答每一个问题。
        </p>
      </header>

      <ChatHistory />

      {apiError && (
        <div className="api-error">
          <span className="api-error-icon">⚠</span>
          <span>{apiError}</span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="dialogue-start">
          <button className="btn-primary" onClick={startDialogue} disabled={loading}>
            {loading ? '正在连接...' : '开始对话'}
          </button>
        </div>
      ) : (
        <ChatInput onSend={handleSend} disabled={loading} />
      )}

      {roundCount >= 4 && (
        <div className="dialogue-finish">
          <button className="btn-text" onClick={generateRecommendations} disabled={loading}>
            我觉得聊得差不多了，看看我的建议 →
          </button>
        </div>
      )}
    </div>
  );
}
