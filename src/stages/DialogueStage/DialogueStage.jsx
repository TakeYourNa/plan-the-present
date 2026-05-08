import { useCallback, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { createSession, sendMessage, getRecommendations } from '../../api/client';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

export default function DialogueStage() {
  const {
    profile, messages, addMessage, setStage, setRecommendations,
    loading, setLoading, sessionId, setSessionId, apiError, setApiError
  } = useApp();
  const [roundCount, setRoundCount] = useState(0);
  const [started, setStarted] = useState(false);

  const startDialogue = useCallback(async () => {
    if (started) return;
    setStarted(true);
    setLoading(true);
    setApiError('');

    try {
      const { sessionId: sid } = await createSession(profile);
      setSessionId(sid);

      const { reply } = await sendMessage(sid, profile, null);
      addMessage('assistant', reply);
    } catch (err) {
      console.error('Dialogue start error:', err);
      setApiError('连接服务失败：' + (err.message || '未知错误'));
      setStarted(false);
    } finally {
      setLoading(false);
    }
  }, [started, profile, addMessage, setLoading, setSessionId, setApiError]);

  const handleSend = useCallback(async (userInput) => {
    addMessage('user', userInput);
    setRoundCount((c) => c + 1);
    setLoading(true);
    setApiError('');

    try {
      const { reply } = await sendMessage(sessionId, profile, userInput);
      addMessage('assistant', reply);
    } catch (err) {
      console.error('Send error:', err);
      setApiError('发送失败：' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [sessionId, profile, addMessage, setLoading, setApiError]);

  const handleGetRecommendations = useCallback(async () => {
    setLoading(true);
    setApiError('');

    try {
      const data = await getRecommendations(sessionId, profile);
      setRecommendations(data);
      setStage('recommend');
    } catch (err) {
      console.error('Recommend error:', err);
      setApiError('生成推荐失败：' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [sessionId, profile, setLoading, setRecommendations, setStage, setApiError]);

  return (
    <div className="stage dialogue-stage">
      <header className="stage-header dialogue-header">
        <h2>探索对话</h2>
        <p className="dialogue-subtitle">请以最诚实的方式回答每一个问题。</p>
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
          <button className="btn-text" onClick={handleGetRecommendations} disabled={loading}>
            我觉得聊得差不多了，看看我的建议 →
          </button>
        </div>
      )}
    </div>
  );
}
