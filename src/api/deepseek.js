import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
  dangerouslyAllowBrowser: true,
});

export async function chat(messages, { temperature = 0.7, maxTokens = 2000 } = {}) {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages,
    temperature,
    max_tokens: maxTokens,
  });
  return response.choices[0].message.content;
}
