import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const DIMENSIONS = [
  {
    key: 'upbringing',
    label: '先天成长环境',
    hint: '这是最重要的维度。你在什么样的家庭中长大？父母是怎样的人、他们如何对待你和彼此？你的童年和青春期里，哪些经历至今仍在影响你的选择和恐惧？你小时候最想成为什么样的人——那个孩子现在还活在你心里吗？',
  },
  {
    key: 'material',
    label: '经济处境',
    hint: '你当前的收入、资产、负债、每月固定支出。你所处行业的前景如何？你对宏观经济变化有什么切身感受？经济上你最担心什么？',
  },
  {
    key: 'relationships',
    label: '关系网络',
    hint: '你的婚姻/亲密关系、家庭关系、友谊。这些关系是在滋养你还是消耗你？其中是否存在以爱为名的控制或索取？你感到被真正理解吗？',
  },
  {
    key: 'social',
    label: '社会位置',
    hint: '你的职业和在社会中的位置。你感到自己的劳动被尊重吗？你在当前环境中是主动的还是被动的？你有什么技能和资本可以改变现状？',
  },
  {
    key: 'education',
    label: '教育与认知',
    hint: '你的教育经历和思维方式。你习惯跟随别人的期待，还是能做出独立判断？你获取和判断信息的能力如何？',
  },
  {
    key: 'body',
    label: '身体与健康',
    hint: '你的身体状态、精力水平、年龄。身体在告诉你什么你一直在忽略的信息？',
  },
  {
    key: 'temporality',
    label: '时间与阶段',
    hint: '你处于人生的哪个阶段？你觉得时间是你的朋友还是敌人？你还有多少空间来转向？',
  },
];

export function AppProvider({ children }) {
  const [stage, setStage] = useState('profile');
  const [profile, setProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [apiError, setApiError] = useState('');

  const updateProfile = useCallback((key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  const value = {
    stage,
    setStage,
    profile,
    updateProfile,
    messages,
    addMessage,
    recommendations,
    setRecommendations,
    loading,
    setLoading,
    sessionId,
    setSessionId,
    apiError,
    setApiError,
    DIMENSIONS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
