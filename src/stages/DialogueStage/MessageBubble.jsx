export default function MessageBubble({ role, content }) {
  const isAssistant = role === 'assistant';

  return (
    <div className={`message-bubble ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="message-avatar">{isAssistant ? '🌿' : '你'}</div>
      <div className="message-content">{content}</div>
    </div>
  );
}
