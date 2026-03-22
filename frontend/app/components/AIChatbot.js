
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'ai_chatbot_state_v2';

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const makeMessage = (role, content, meta = {}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
  content,
  time: formatTime(new Date()),
  meta
});

const normalizeMessage = (msg) => {
  if (!msg || typeof msg !== 'object') return null;
  const role = msg.role === 'user' ? 'user' : 'assistant';
  const content = typeof msg.content === 'string' ? msg.content : '';
  if (!content) return null;
  return {
    id: msg.id || `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    time: msg.time || formatTime(new Date()),
    meta: msg.meta || {}
  };
};

const getDefaultMessages = () => [
  makeMessage(
    'assistant',
    `Hey! I'm Ashu's AI Assistant.\n\nI can help with:\n- Services & pricing\n- Project timelines & estimates\n- Project planning\n- Currency conversion\n- Calculator\n- Contact & availability\n\nWhat would you like to know?`,
    { tag: 'welcome' }
  )
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => getDefaultMessages());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [lastIntent, setLastIntent] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationMode, setConversationMode] = useState('smart');
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    GBP: 0.79,
    AUD: 1.53,
    CAD: 1.36,
    JPY: 149.5,
    AED: 3.67,
    SGD: 1.34
  });
  const [ratesLastUpdated, setRatesLastUpdated] = useState(null);

  const [convertFrom, setConvertFrom] = useState('USD');
  const [convertTo, setConvertTo] = useState('INR');
  const [convertAmount, setConvertAmount] = useState('');
  const [converterResult, setConverterResult] = useState('');

  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcHistory, setCalcHistory] = useState('');
  const calcDisplayRef = useRef('0');

  const quickQuestions = [
    'What services do you offer?',
    'Show currency converter',
    'Open calculator',
    "What's the typical project timeline?",
    'How can I contact you?',
    'Do you offer maintenance?'
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.messages?.length) {
        const cleaned = saved.messages.map(normalizeMessage).filter(Boolean);
        if (cleaned.length) setMessages(cleaned);
      }
      if (typeof saved?.isOpen === 'boolean') setIsOpen(saved.isOpen);
      if (typeof saved?.showSuggestions === 'boolean') setShowSuggestions(saved.showSuggestions);
      if (saved?.conversationMode) setConversationMode(saved.conversationMode);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, isOpen, showSuggestions, conversationMode })
      );
    } catch (e) {
      // ignore
    }
  }, [messages, isOpen, showSuggestions, conversationMode]);

  useEffect(() => {
    fetchCurrencyRates();
    const interval = setInterval(fetchCurrencyRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrencyRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      if (data.rates) {
        setExchangeRates({
          USD: 1,
          INR: data.rates.INR || 83.5,
          EUR: data.rates.EUR || 0.92,
          GBP: data.rates.GBP || 0.79,
          AUD: data.rates.AUD || 1.53,
          CAD: data.rates.CAD || 1.36,
          JPY: data.rates.JPY || 149.5,
          AED: data.rates.AED || 3.67,
          SGD: data.rates.SGD || 1.34
        });
        setRatesLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      // fallback already in state
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, showConverter, showCalculator]);

  useEffect(() => {
    calcDisplayRef.current = calcDisplay;
  }, [calcDisplay]);

  const intents = useMemo(
    () => [
      {
        key: 'services',
        keywords: ['service', 'offer', 'what do you do', 'solutions', 'help with'],
        answer: `🛠️ What I can build for you:\n\n- High-converting websites\n- Full-stack web apps\n- APIs & integrations\n- UI/UX polish that feels premium\n- Ongoing maintenance & support\n\nShare your idea in 1-2 lines and I'll map the best, fastest path to launch.`,
        actions: ['Project timeline?', 'Pricing details', 'Start a project']
      },
      {
        key: 'pricing',
        keywords: ['price', 'cost', 'budget', 'hire', 'rate', 'pricing'],
        answer: `💰 Pricing (range-based):\n\nIndia: ₹25K - ₹5L+\nInternational: $420 - $10K+\n\nIf you tell me scope + deadline, I'll give you a clear range and suggest the most cost-effective plan.`,
        actions: ['Share project scope', 'Timeline estimate', 'Contact']
      },
      {
        key: 'timeline',
        keywords: ['time', 'timeline', 'how long', 'delivery', 'deadline'],
        answer: `⏱️ Typical timelines:\n\n- Landing page: 1-2 weeks\n- Business site: 2-4 weeks\n- Web app: 4-8 weeks\n- E-commerce: 6-10 weeks\n\nIf you have a date in mind, I can compress the plan and prioritize what's essential.`,
        actions: ['Pricing estimate', 'Share requirements']
      },
      {
        key: 'contact',
        keywords: ['contact', 'email', 'reach', 'call', 'schedule', 'meet'],
        answer: `📞 Contact:\n\n- Email: helloashutosh1@outlook.com\n- Response: within 12-24 hours\n- Remote-friendly (India based)\n\nShare your goal and timeline, and I'll come back with a clear, actionable plan.`,
        actions: ['Availability', 'Start a project']
      },
      {
        key: 'skills',
        keywords: ['skill', 'experience', 'stack', 'tech', 'tools'],
        answer: `💻 Skills & Stack:\n\nFrontend: React, Next.js, TypeScript\nBackend: Node.js, Express, REST APIs\nDB: MongoDB, PostgreSQL, Firebase\nCloud: AWS, Docker\n\n5+ years shipping production web apps that feel fast and convert.`,
        actions: ['Projects', 'Why choose you?']
      },
      {
        key: 'projects',
        keywords: ['project', 'portfolio', 'built', 'case study', 'work'],
        answer: `📁 Featured work:\n\n- ServiGo - multi-role service platform\n- IMC Billing - inventory + billing\n- Multi-vendor e-commerce\n- HR dashboard - employee management\n\nTell me your industry and I'll show the closest match.`,
        actions: ['Project timeline', 'Pricing']
      },
      {
        key: 'availability',
        keywords: ['available', 'freelance', 'open for work', 'hire you'],
        answer: `✅ Availability:\n\n- Open for full-time and freelance\n- Remote work supported\n- Typical response: 12-24 hours\n\nIf your project is time-sensitive, mention the deadline and I'll reserve a slot.`,
        actions: ['Contact', 'Pricing']
      },
      {
        key: 'maintenance',
        keywords: ['maintenance', 'support', 'retainer'],
        answer: `🧰 Maintenance & Support:\n\n- Bug fixes & improvements\n- Hosting & monitoring\n- Small feature additions\n\nMonthly plans start at ₹10K / $150. Keeps your site fast and reliable.`,
        actions: ['Contact', "What's included?"]
      },
      {
        key: 'process',
        keywords: ['process', 'how you work', 'workflow'],
        answer: `🔄 Delivery process:\n\n1. Discovery call\n2. Proposal & timeline\n3. Development\n4. QA & revisions\n5. Launch & support\n\nIf you share your idea now, I can outline step 1 immediately.`,
        actions: ['Schedule a call', 'Project timeline']
      },
      {
        key: 'location',
        keywords: ['location', 'where are you', 'based in'],
        answer: `📍 Based in India, working globally with clients in the USA, UK, UAE, Australia, Singapore and more.`
      },
      {
        key: 'calculator',
        keywords: ['calculator', 'calculate', 'math'],
        answer: `🧮 Calculator ready. Click "Open calculator".`
      },
      {
        key: 'converter',
        keywords: ['convert', 'currency', 'exchange', 'usd', 'inr'],
        answer: `💱 Currency converter ready. Click "Show currency converter".`
      },
      {
        key: 'about',
        keywords: ['about', 'who are you', 'profile'],
        answer: `👨‍💻 About Ashu:\n\nFull-stack developer focused on fast, clean, production-ready web apps. Strong on UX and performance.`
      }
    ],
    []
  );

  const suggestionChips = useMemo(
    () => [
      'Estimate my project',
      "What's your process?",
      'Show portfolio highlights',
      'Can you build an MVP?',
      'How do we start?',
      'Open calculator'
    ],
    []
  );

  const matchIntent = (text) => {
    const q = text.toLowerCase();
    let best = { score: 0, intent: null };
    for (const intent of intents) {
      let score = 0;
      for (const keyword of intent.keywords) {
        if (q.includes(keyword)) score += keyword.length > 6 ? 2 : 1;
      }
      if (score > best.score) best = { score, intent };
    }
    return best.intent;
  };

  const maybeOpenTools = (q) => {
    if (/(convert|currency|exchange|usd|inr|eur|gbp)/i.test(q)) {
      setShowConverter(true);
      setShowCalculator(false);
    }
    if (/(calculator|calculate|math)/i.test(q)) {
      setShowCalculator(true);
      setShowConverter(false);
    }
  };

  const generateResponse = (question) => {
    const q = question.toLowerCase();

    if (q.length <= 3 && lastIntent) {
      const followUp = intents.find((i) => i.key === lastIntent);
      if (followUp) return followUp.answer;
    }

    const matched = matchIntent(q);
    if (matched) {
      setLastIntent(matched.key);
      return matched.answer;
    }

    if (q.includes('estimate') || q.includes('mvp') || q.includes('scope')) {
      return `📌 Quick estimate? Share:\n\n- Goal + audience\n- Key features\n- Timeline\n- Preferred budget\n\nI'll respond with a realistic range and the fastest route to launch.`;
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `👋 Hey there!\n\nTell me what you're building and your deadline. I'll guide you to a clean, high-converting result.`;
    }

    if (q.includes('thanks') || q.includes('thank')) {
      return `You're welcome. If you share scope + timeline, I'll send a clean estimate and next steps.`;
    }

    if (conversationMode === 'smart') {
      return `Great question. To give you a precise answer, share:\n\n- Your goal or problem\n- Must-have features\n- Target launch date\n\nI’ll respond with a clear plan, effort estimate, and best next step.`;
    }

    return `I can help with services, pricing, timelines, and how to start. Tell me the goal and your deadline.`;
  };

  const pushAssistant = (text, meta = {}) => {
    setMessages((prev) => [...prev, makeMessage('assistant', text, meta)]);
  };

  const renderMessageContent = (content) => {
    const blocks = content.split(/\n{2,}/).filter(Boolean);
    return blocks.map((block, idx) => {
      const lines = block.split('\n').filter(Boolean);
      const isList = lines.length > 1 && lines.every((l) => /^[-•]\s+/.test(l));
      if (isList) {
        return (
          <ul key={`list-${idx}`} style={{ margin: '6px 0 0 18px', padding: 0, lineHeight: 1.6 }}>
            {lines.map((line, i) => (
              <li key={`item-${i}`} style={{ marginBottom: '4px' }}>
                {line.replace(/^[-•]\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={`p-${idx}`} style={{ margin: idx === 0 ? 0 : '8px 0 0', lineHeight: 1.6 }}>
          {lines.join('\n')}
        </p>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setShowConverter(false);
    setShowCalculator(false);

    setMessages((prev) => [...prev, makeMessage('user', userMessage)]);
    maybeOpenTools(userMessage);

    setTimeout(() => {
      const response = generateResponse(userMessage);
      pushAssistant(response);
      setIsLoading(false);
    }, 650);
  };

  const handleQuickQuestion = (question) => {
    setInput('');
    setMessages((prev) => [...prev, makeMessage('user', question)]);

    if (question === 'Show currency converter') {
      setShowConverter(true);
      setShowCalculator(false);
      setConverterResult('');
      return;
    }

    if (question === 'Open calculator') {
      setShowCalculator(true);
      setShowConverter(false);
      setCalcDisplay('0');
      setCalcHistory('');
      return;
    }

    setIsLoading(true);
    maybeOpenTools(question);

    setTimeout(() => {
      const response = generateResponse(question);
      pushAssistant(response);
      setIsLoading(false);
    }, 650);
  };

  const handleConvert = () => {
    const amount = parseFloat(convertAmount);
    if (isNaN(amount) || amount <= 0) {
      setConverterResult('Please enter a valid amount to convert.');
      return;
    }

    const inUSD = amount / exchangeRates[convertFrom];
    const result = inUSD * exchangeRates[convertTo];

    const response = `Conversion Result:\n${amount.toLocaleString()} ${convertFrom} = ${result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${convertTo}\nRates updated: ${ratesLastUpdated || 'Using latest available'}`;

    setConverterResult(response);
    setConvertAmount('');
  };

  useEffect(() => {
    if (!showCalculator) return;
    if (chatInputRef.current) {
      chatInputRef.current.blur();
    }
    const handleKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;

      const key = event.key;
      if (/^\d$/.test(key)) {
        handleCalcInput(key);
        event.preventDefault();
        return;
      }
      if (key === '.') {
        handleCalcInput('.');
        event.preventDefault();
        return;
      }
      if (key === '+' || key === '-') {
        handleCalcInput(key);
        event.preventDefault();
        return;
      }
      if (key === '*' || key === 'x' || key === 'X') {
        handleCalcInput('×');
        event.preventDefault();
        return;
      }
      if (key === '/') {
        handleCalcInput('÷');
        event.preventDefault();
        return;
      }
      if (key === 'Enter' || key === 'NumpadEnter' || key === '=') {
        handleCalcInput('=');
        event.preventDefault();
        return;
      }
      if (key === 'Backspace') {
        handleCalcInput('⌫');
        event.preventDefault();
        return;
      }
      if (key === 'Delete') {
        handleCalcInput('C');
        event.preventDefault();
        return;
      }
      if (key === 'Escape') {
        setShowCalculator(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCalculator]);

  const handleCalcInput = (value) => {
    if (value === 'C') {
      setCalcDisplay('0');
      setCalcHistory('');
    } else if (value === '=') {
      try {
        const currentDisplay = calcDisplayRef.current;
        let expr = currentDisplay.replace(/×/g, '*').replace(/÷/g, '/');
        if (!/[+\-*/]/.test(expr)) {
          setCalcHistory('');
          setCalcDisplay(String(expr));
          return;
        }
        if (/[+\-*/]$/.test(expr)) {
          return;
        }
        const result = Function('"use strict"; return (' + expr + ')')();

        if (!isNaN(result) && isFinite(result)) {
          setCalcHistory(`${currentDisplay} = ${result}`);
          const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
          setCalcDisplay(String(formatted));
        } else {
          setCalcDisplay('Error');
        }
      } catch (e) {
        setCalcDisplay('Error');
      }
    } else if (value === '⌫') {
      setCalcDisplay((prev) => (prev.length === 1 ? '0' : prev.slice(0, -1)));
    } else if (value === '+' || value === '-' || value === '×' || value === '÷') {
      setCalcDisplay((prev) => {
        if (prev === 'Error') return value;
        const lastChar = prev.slice(-1);
        if (['+', '-', '×', '÷'].includes(lastChar)) {
          return prev.slice(0, -1) + value;
        }
        return prev + value;
      });
    } else if (value === '.') {
      setCalcDisplay((prev) => {
        if (prev === 'Error') return '0.';
        const lastOpIndex = Math.max(
          prev.lastIndexOf('+'),
          prev.lastIndexOf('-'),
          prev.lastIndexOf('×'),
          prev.lastIndexOf('÷')
        );
        const currentSegment = prev.slice(lastOpIndex + 1);
        if (currentSegment.includes('.')) return prev;
        return prev + '.';
      });
    } else {
      setCalcDisplay((prev) => {
        if (prev === '0' || prev === 'Error') return value;
        return prev + value;
      });
    }
  };

  const calcButtons = [
    { val: 'C', type: 'clear' },
    { val: '⌫', type: 'delete' },
    { val: '÷', type: 'op' },
    { val: '×', type: 'op' },
    { val: '7', type: 'num' },
    { val: '8', type: 'num' },
    { val: '9', type: 'num' },
    { val: '-', type: 'op' },
    { val: '4', type: 'num' },
    { val: '5', type: 'num' },
    { val: '6', type: 'num' },
    { val: '+', type: 'op' },
    { val: '1', type: 'num' },
    { val: '2', type: 'num' },
    { val: '3', type: 'num' },
    { val: '=', type: 'equals' },
    { val: '0', type: 'num', wide: true },
    { val: '.', type: 'num' }
  ];

  const clearChat = () => {
    setMessages(getDefaultMessages());
    setShowConverter(false);
    setShowCalculator(false);
    setLastIntent('');
    setConverterResult('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const fixedButtonStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '12px',
    width: '72px',
    height: '72px',
    borderRadius: '18px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 12px 26px rgba(0, 0, 0, 0.18)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    animation: 'chat-breathe 3.6s ease-in-out infinite',
    padding: 0
  };


  const chatWindowStyle = {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: '400px',
    maxWidth: 'calc(100vw - 40px)',
    height: '560px',
    maxHeight: 'calc(100vh - 140px)',
    background: 'var(--chat-bg)',
    backdropFilter: 'blur(18px)',
    borderRadius: '18px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid var(--chat-border)'
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={fixedButtonStyle}
        className="chat-toggle"
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 16px 34px rgba(10, 143, 106, 0.35)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(10, 143, 106, 0.25)';
        }}
        title="Chat with AI"
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isOpen && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                color: 'var(--chat-text)',
                background: 'var(--chat-bg)',
                border: '1px solid var(--chat-border)',
                borderRadius: '18px'
              }}
            >
              ✕
            </span>
          )}
          <img
            src="/images/AI.png"
            alt="Chat"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '18px',
              opacity: isOpen ? 0 : 1
            }}
          />
          
        </div>
      </button>

      {isOpen && (
        <div style={chatWindowStyle} className="chat-window">
          <div
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, rgba(16, 132, 99, 0.95), rgba(99,102,241,0.95))',
              color: 'var(--chat-header-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.4rem' }}>
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <circle cx="14" cy="14" r="10" fill="rgba(255,255,255,0.9)" />
                  <circle cx="14" cy="14" r="9.5" stroke="rgba(255,255,255,0.6)" />
                  <path
                    d="M10.6 14c0-1.9 1.5-3.4 3.4-3.4 1.4 0 2.6.8 3.1 2"
                    stroke="#0a8f6a"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="10.2" cy="14.2" r="1.2" fill="#0a8f6a" />
                  <circle cx="17.4" cy="12.6" r="1" fill="#6366f1" />
                  <path
                    d="M16.6 18.2c-1.7 1.2-3.9 1.2-5.6 0"
                    stroke="#6366f1"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <strong>AI Assistant</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--chat-header-muted)' }}>
                  Online - {conversationMode === 'smart' ? 'Smart' : 'FAQ'} Mode
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setShowConverter(true);
                  setShowCalculator(false);
                }}
                style={{
                  background: 'var(--chat-bubble)',
                  border: '1px solid var(--chat-border)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'var(--chat-text)',
                  cursor: 'pointer',
                  fontSize: '0.7rem'
                }}
              >
                Currency
              </button>
              <button
                onClick={() => {
                  setShowCalculator(true);
                  setShowConverter(false);
                }}
                style={{
                  background: 'var(--chat-bubble)',
                  border: '1px solid var(--chat-border)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'var(--chat-text)',
                  cursor: 'pointer',
                  fontSize: '0.7rem'
                }}
              >
                Calculator
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'var(--chat-bubble)',
                  border: '1px solid var(--chat-border)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'var(--chat-text)',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {showConverter && (
            <div
              style={{
                padding: '14px',
                background: 'var(--chat-panel)',
                borderBottom: '1px solid var(--chat-border)'
              }}
            >
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '10px',
                  color: 'var(--chat-text)'
                }}
              >
                💱 Currency Converter{' '}
                {ratesLastUpdated && (
                  <span style={{ fontWeight: 400, fontSize: '0.7rem', color: 'var(--chat-muted)' }}>
                    (updated {ratesLastUpdated})
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => {
                    setConvertAmount(e.target.value);
                    setConverterResult('');
                  }}
                  placeholder="Amount"
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--chat-border)',
                    background: 'var(--chat-input)',
                    color: 'var(--chat-text)',
                    fontSize: '0.85rem'
                  }}
                />
                <select
                  value={convertFrom}
                  onChange={(e) => {
                    setConvertFrom(e.target.value);
                    setConverterResult('');
                  }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--chat-border)',
                    background: 'var(--chat-input)',
                    color: 'var(--chat-text)',
                    fontSize: '0.8rem'
                  }}
                >
                  {Object.keys(exchangeRates).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                <select
                  value={convertTo}
                  onChange={(e) => {
                    setConvertTo(e.target.value);
                    setConverterResult('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--chat-border)',
                    background: 'var(--chat-input)',
                    color: 'var(--chat-text)',
                    fontSize: '0.8rem'
                  }}
                >
                  {Object.keys(exchangeRates).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleConvert}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0a8f6a, #6366f1)',
                    color: 'var(--chat-header-text)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  Convert
                </button>
              </div>
              <button
                onClick={() => {
                  setShowConverter(false);
                  setConverterResult('');
                }}
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--chat-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Close converter
              </button>
              {converterResult && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'var(--chat-input)',
                    color: 'var(--chat-text)',
                    fontSize: '0.78rem',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid var(--chat-border)'
                  }}
                >
                  {converterResult}
                </div>
              )}
            </div>
          )}

          {showCalculator && (
            <div
              style={{
                padding: '12px',
                background: 'var(--chat-panel)',
                borderBottom: '1px solid var(--chat-border)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--chat-text)' }}>
                  🧮 Calculator
                </div>
                <button
                  onClick={() => setShowCalculator(false)}
                  style={{ fontSize: '0.7rem', color: 'var(--chat-muted)', background: 'none', border: 'none' }}
                >
                  Close
                </button>
              </div>

              <div
                style={{
                  background: 'var(--chat-input)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--chat-muted)',
                    textAlign: 'right',
                    minHeight: '14px',
                    fontFamily: 'monospace',
                    marginBottom: '4px'
                  }}
                >
                  {calcHistory}
                </div>
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 600,
                    textAlign: 'right',
                    color: 'var(--chat-text)',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    wordBreak: 'break-all',
                    lineHeight: 1.2
                  }}
                >
                  {calcDisplay}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {calcButtons.map((btn, i) => {
                  const isOp = btn.type === 'op';
                  const isEquals = btn.type === 'equals';
                  const isDelete = btn.type === 'delete';
                  const isClear = btn.type === 'clear';
                  const isWide = btn.wide;

                  let bg = '#ffffff';
                  let color = '#1a1a2e';

                  if (isOp) {
                    bg = 'linear-gradient(135deg, #667eea, #764ba2)';
                    color = 'white';
                  } else if (isEquals) {
                    bg = 'linear-gradient(135deg, #0a8f6a, #059669)';
                    color = 'white';
                  } else if (isDelete) {
                    bg = '#f59e0b';
                    color = 'white';
                  } else if (isClear) {
                    bg = '#ef4444';
                    color = 'white';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleCalcInput(btn.val)}
                      style={{
                        padding: '16px 8px',
                        fontSize: '1.1rem',
                        fontWeight: isOp || isEquals || isClear ? 600 : 500,
                        background: bg,
                        color: color,
                        border: 'none',
                        borderRadius: btn.val === '0' ? '12px' : '10px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        gridColumn: isWide ? 'span 2' : 'span 1',
                        fontFamily: "'Poppins', 'Segoe UI', sans-serif"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(0.98)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }}
                    >
                      {btn.val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'var(--chat-surface)'
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px',
                    maxWidth: '92%',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background:
                      msg.role === 'user'
                        ? 'var(--chat-user-bg)'
                        : 'var(--chat-bubble)',
                    color: msg.role === 'user' ? '#ffffff' : 'var(--chat-answer-text)',
                    border: msg.role === 'assistant' ? '1px solid var(--chat-border)' : '1px solid rgba(255,255,255,0.12)',
                    lineHeight: 1.6,
                    fontSize: '0.92rem',
                    boxShadow:
                      msg.role === 'user'
                        ? 'var(--chat-user-shadow)'
                        : '0 8px 18px rgba(15, 23, 42, 0.12)'
                  }}
                >
                  {renderMessageContent(msg.content)}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--chat-muted)',
                    marginTop: '4px',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  alignSelf: 'flex-start',
                  background: 'var(--chat-bubble)',
                  border: '1px solid var(--chat-border)',
                  fontSize: '0.8rem',
                  color: 'var(--chat-text)'
                }}
              >
                <span className="typing">Thinking</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && messages.length <= 3 && !showConverter && !showCalculator && (
            <div
              style={{
                padding: '8px 10px',
                borderTop: '1px solid var(--chat-border)',
                background: 'var(--chat-panel)'
              }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--chat-muted)', marginBottom: '6px' }}>
                Quick questions
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.65rem',
                      background: 'var(--chat-bubble)',
                      border: '1px solid var(--chat-border)',
                      borderRadius: '14px',
                      color: 'var(--chat-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSuggestions && messages.length > 3 && !showConverter && !showCalculator && (
            <div
              style={{
                padding: '8px 10px',
                borderTop: '1px solid var(--chat-border)',
                background: 'var(--chat-panel)'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestionChips.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.65rem',
                      background: 'var(--chat-bubble)',
                      border: '1px solid var(--chat-border)',
                      borderRadius: '14px',
                      color: 'var(--chat-text)',
                      cursor: 'pointer'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              padding: '10px',
              borderTop: '1px solid var(--chat-border)',
              display: 'flex',
              gap: '6px',
              background: 'var(--chat-panel)'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, pricing, timelines..."
              disabled={isLoading || showCalculator}
              ref={chatInputRef}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '20px',
                border: '1px solid var(--chat-border)',
                background: 'var(--chat-input)',
                color: 'var(--chat-text)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={clearChat}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--chat-bubble)',
                border: '1px solid var(--chat-border)',
                color: 'var(--chat-text)',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              title="Clear chat"
            >
              ↺
            </button>
            <button
              type="submit"
              disabled={isLoading || showCalculator || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background:
                  isLoading || !input.trim()
                    ? 'var(--chat-bubble)'
                    : 'linear-gradient(135deg, #0a8f6a, #6366f1)',
                border: 'none',
                color: isLoading || !input.trim() ? 'var(--chat-text)' : 'white',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .chat-window {
          box-sizing: border-box;
        }

        @media (max-width: 520px) {
          .chat-window {
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
            max-width: none !important;
            bottom: 90px !important;
            height: calc(100vh - 140px) !important;
            max-height: calc(100vh - 140px) !important;
          }

          .chat-toggle {
            right: 10px !important;
            bottom: 18px !important;
          }
        }

        .typing::after {
          content: '...';
          display: inline-block;
          width: 1.2em;
          animation: dots 1.2s steps(4, end) infinite;
        }

        .chat-pulse {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15);
          animation: pulse-ring 2.4s ease-out infinite;
        }

        @keyframes chat-breathe {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.02);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.85);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.2);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes dots {
          0% {
            width: 0;
          }
          100% {
            width: 1.2em;
          }
        }
      `}</style>
    </>
  );
}



