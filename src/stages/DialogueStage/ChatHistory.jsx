import { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import MessageBubble from './MessageBubble';

export default function ChatHistory() {
  const { messages, loading } = useApp();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-history">
      {messages.length === 0 && (
        <div className="chat-empty">
          <p>对话即将开始。请真诚地面对自己。</p>
        </div>
      )}
      {messages.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} />
      ))}
      {loading && (
        <div className="message-bubble assistant">
          <div className="message-avatar">🌿</div>
          <div className="message-content typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
