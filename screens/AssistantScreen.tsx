// CLEANED - CSS vars fixed

import React, { useState, useEffect, useRef } from 'react';
import type { Screen } from '../types';
import { createAssistantChat } from '../services/ai';
import type { Chat } from '@google/genai';
import { SendIcon, ChevronLeftIcon } from '../components/icons';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useSound } from '../hooks/useSound';
import { useData } from '../src/contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

type Persona = 'general' | 'fitness' | 'nutrition' | 'psychology';

const PERSONA_CONFIG: Record<Persona, { label: string; icon: string; color: string; suggestions: string[] }> = {
  general: {
    label: 'כללי',
    icon: '✨',
    color: 'from-blue-500 to-cyan-500',
    suggestions: ['סיכום יום', 'מה המשימות שלי?', 'ארגן לי את הלו"ז'],
  },
  fitness: {
    label: 'מאמן',
    icon: '💪',
    color: 'from-orange-500 to-red-500',
    suggestions: ['אימון להיום?', 'טיפ להתאוששות', 'כמה התאמנתי השבוע?'],
  },
  nutrition: {
    label: 'תזונה',
    icon: '🥗',
    color: 'from-green-500 to-emerald-500',
    suggestions: ['רעיון לארוחת ערב', 'כמה מים שתיתי?', 'עקרונות לתזונה נכונה'],
  },
  psychology: {
    label: 'נפש',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-500',
    suggestions: ['אני מרגיש לחוץ', 'תרגיל נשימה', 'רפלקציה יומית'],
  },
};

interface AssistantScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const AssistantScreen: React.FC<AssistantScreenProps> = ({ setActiveScreen }) => {
  const { feedItems, personalItems } = useData();
  const { playClick, playSuccess } = useSound();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activePersona, setActivePersona] = useState<Persona>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        const chatSession = await createAssistantChat(feedItems, personalItems);
        setChat(chatSession);

        // Fetch initial history or set welcome message based on persona
        const welcomeMessages: Record<Persona, string> = {
          general: "אהלן! אני המרכז שלך לניהול החיים. איך אפשר לעזור היום?",
          fitness: "מוכן לתת עבודה? 💪 אני כאן כדי לדחוף אותך לקצה.",
          nutrition: "היי! בוא נדבר על דלק לגוף. מה אכלת היום?",
          psychology: "שלום. קח נשימה עמוקה. אני כאן כדי להקשיב."
        };

        setMessages([
          {
            id: 'welcome',
            role: 'model',
            text: welcomeMessages[activePersona],
            isTyping: false,
          },
        ]);
      } catch (error) {
        console.error('Failed to initialize assistant chat:', error);
        setMessages([
          {
            id: 'error',
            role: 'model',
            text: 'שגיאה בהפעלת היועץ. נסה שוב מאוחר יותר.',
            isTyping: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [feedItems, personalItems, activePersona]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || !chat || isLoading) return;

    playClick();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      isTyping: false,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.text });

      let modelResponse = '';
      const modelMessageId = `model-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        { id: modelMessageId, role: 'model', text: '', isTyping: true },
      ]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev =>
          prev.map(msg => (msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg))
        );
      }

      setMessages(prev =>
        prev.map(msg => (msg.id === modelMessageId ? { ...msg, isTyping: false } : msg))
      );
      playSuccess(); // Subtle sound on completion
    } catch (error) {
      console.error('Failed to get assistant response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: 'התנצלותי, נתקלתי בשגיאה.',
        isTyping: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--text-secondary, rgba(255,255,255,0.5))' }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      className="relative h-[calc(100vh-80px)] overflow-hidden font-sans"
      style={{
        background: 'var(--bg-primary, #000)',
        color: 'var(--text-primary, #fff)',
      }}
    >
      {/* Dynamic Background Gradient acting as ambient light */}
      <div className={`absolute top-0 left-0 right-0 h-96 opacity-15 blur-[120px] bg-gradient-to-b ${PERSONA_CONFIG[activePersona].color} pointer-events-none transition-all duration-1000`} />

      {/* Header - Glassmorphism */}
      <header
        className="absolute top-0 left-0 right-0 z-20 flex flex-col pt-4 pb-3 px-4"
        style={{
          background: 'var(--surface-glass, rgba(0,0,0,0.1))',
          backdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
          WebkitBackdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
          borderBottom: '0.33px solid var(--border-subtle, rgba(255,255,255,0.05))',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setActiveScreen('library')}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 -ml-1 rounded-2xl transition-all duration-200"
              style={{
                background: 'var(--gray-50, rgba(255,255,255,0.05))',
                border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.08))',
                color: 'var(--text-secondary, rgba(255,255,255,0.7))',
              }}
              aria-label="חזור לספרייה"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-wide flex items-center gap-2.5" style={{ color: 'var(--text-primary, #fff)' }}>
                יועץ אישי
                <motion.span
                  key={activePersona}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: 'var(--gray-100, rgba(255,255,255,0.1))',
                    border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.05))',
                    color: 'var(--text-secondary, rgba(255,255,255,0.6))',
                  }}
                >
                  {PERSONA_CONFIG[activePersona].label}
                </motion.span>
              </h1>
            </div>
          </div>
          {/* Main Persona Icon */}
          <motion.div
            key={activePersona}
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="text-2xl"
          >
            {PERSONA_CONFIG[activePersona].icon}
          </motion.div>
        </div>

        {/* Persona Switcher (Tabs) - Premium segmented control */}
        <div
          className="relative flex p-1 rounded-2xl"
          style={{
            background: 'var(--gray-50, rgba(255,255,255,0.05))',
            border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.05))',
          }}
        >
          {(Object.keys(PERSONA_CONFIG) as Persona[]).map((persona) => (
            <motion.button
              key={persona}
              onClick={() => {
                if (activePersona !== persona) {
                  playClick();
                  setActivePersona(persona);
                }
              }}
              whileTap={{ scale: 0.97 }}
              className="relative flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 z-10"
              style={{
                color: activePersona === persona ? 'var(--text-primary, #fff)' : 'var(--text-muted, rgba(255,255,255,0.4))',
              }}
            >
              {activePersona === persona && (
                <motion.div
                  layoutId="activePersonaTab"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'var(--gray-150, rgba(255,255,255,0.1))',
                    boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.2))',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{PERSONA_CONFIG[persona].label}</span>
            </motion.button>
          ))}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pt-44 pb-36 px-4 space-y-5 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: msg.role === 'model' ? 0.05 : 0,
              }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[85%] px-5 py-3.5 ${msg.role === 'user'
                  ? `bg-gradient-to-br ${PERSONA_CONFIG[activePersona].color} text-white rounded-2xl rounded-tr-md`
                  : 'rounded-2xl rounded-tl-md'
                  }`}
                style={msg.role === 'model' ? {
                  background: 'var(--gray-50, rgba(255,255,255,0.08))',
                  border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.06))',
                  backdropFilter: 'blur(12px)',
                  color: 'var(--text-primary, #e5e5e5)',
                } : {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                }}
              >
                <MarkdownRenderer
                  content={msg.text}
                  animate={msg.role === 'model' && msg.isTyping}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="flex justify-start"
          >
            <div
              className="rounded-2xl rounded-tl-md"
              style={{
                background: 'var(--gray-50, rgba(255,255,255,0.05))',
                border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.06))',
                backdropFilter: 'blur(12px)',
              }}
            >
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-6 left-4 right-4 z-30 flex flex-col gap-3">

        {/* Suggestion Chips */}
        <AnimatePresence>
          {messages.length <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            >
              {PERSONA_CONFIG[activePersona].suggestions.map((suggestion, idx) => (
                <motion.button
                  key={`${activePersona}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 500, damping: 30 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(suggestion)}
                  className="whitespace-nowrap px-4 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200"
                  style={{
                    background: 'var(--gray-50, rgba(255,255,255,0.05))',
                    border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.1))',
                    color: 'var(--text-secondary, rgba(255,255,255,0.9))',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Field */}
        <div
          className="flex items-center gap-2 p-1.5 pl-4 rounded-full"
          style={{
            background: 'var(--surface-glass, rgba(0,0,0,0.6))',
            backdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
            WebkitBackdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
            border: '0.5px solid var(--border-subtle, rgba(255,255,255,0.1))',
            boxShadow: 'var(--shadow-xl, 0 20px 40px rgba(0,0,0,0.3))',
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`שאל את ה${PERSONA_CONFIG[activePersona].label}...`}
            disabled={isLoading}
            className="flex-1 bg-transparent text-base focus:outline-none disabled:opacity-50"
            style={{
              color: 'var(--text-primary, #fff)',
            }}
            autoFocus
          />
          <motion.button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            whileTap={{ scale: 0.92 }}
            className={`p-3 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${inputValue.trim() ? `bg-gradient-to-r ${PERSONA_CONFIG[activePersona].color} text-white` : ''
              }`}
            style={!inputValue.trim() ? {
              background: 'var(--gray-100, rgba(255,255,255,0.1))',
              color: 'var(--text-muted, rgba(255,255,255,0.3))',
            } : {
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            }}
            aria-label="שלח הודעה"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 rounded-full"
                style={{ borderColor: 'var(--text-muted, rgba(255,255,255,0.3))', borderTopColor: 'var(--text-primary, #fff)' }}
              />
            ) : (
              <SendIcon className="w-5 h-5 -rotate-45 ml-0.5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
