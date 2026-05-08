const BASE = '/api';

export async function createSession(profile) {
  const res = await fetch(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function sendMessage(sessionId, profile, userMessage) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, profile, userMessage }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || data.error || 'Chat failed');
  }
  return res.json();
}

export async function getRecommendations(sessionId, profile) {
  const res = await fetch(`${BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, profile }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || data.error || 'Recommend failed');
  }
  return res.json();
}

export async function getSession(sessionId) {
  const res = await fetch(`${BASE}/sessions/${sessionId}`);
  if (!res.ok) return null;
  return res.json();
}
