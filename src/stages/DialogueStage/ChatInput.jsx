import { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        className="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="写下你的想法..."
        disabled={disabled}
      />
      <button className="btn-send" type="submit" disabled={disabled || !text.trim()}>
        发送
      </button>
    </form>
  );
}
