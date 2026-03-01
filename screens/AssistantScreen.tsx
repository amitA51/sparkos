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

type Persona = 'general' | 'fitness' | 'nutrition' | 'pyschology';

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
  pyschology: {
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
          pyschology: "שלום. קח נשימה עמוקה. אני כאן כדי להקשיב."
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
    <div className="flex items-center space-x-1 p-3">
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
    </div>
  );

  return (
    <div className="relative h-[calc(100vh-80px)] overflow-hidden bg-black text-white font-sans selection:bg-white/20">
      {/* Dynamic Background Gradient acting as ambient light */}
      <div className={`absolute top-0 left-0 right-0 h-96 opacity-20 blur-[100px] bg-gradient-to-b ${PERSONA_CONFIG[activePersona].color} pointer-events-none transition-colors duration-1000`} />

      {/* Header - Glassmorphism */}
      <header className="absolute top-0 left-0 right-0 z-20 flex flex-col pt-4 pb-2 px-4 bg-black/10 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('library')}
              className="p-2 -ml-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-all active:scale-95"
              aria-label="חזור לספרייה"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                יועץ אישי
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-white/60">
                  {PERSONA_CONFIG[activePersona].label}
                </span>
              </h1>
            </div>
          </div>
          {/* Main Persona Icon (Decorative) */}
          <div className={`text-2xl opacity-80 animate-pulse`}>
            {PERSONA_CONFIG[activePersona].icon}
          </div>
        </div>

        {/* Persona Switcher (Tabs) */}
        <div className="flex bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/5">
          {(Object.keys(PERSONA_CONFIG) as Persona[]).map((persona) => (
            <button
              key={persona}
              onClick={() => {
                if (activePersona !== persona) {
                  playClick();
                  setActivePersona(persona);
                }
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activePersona === persona
                ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
            >
              {PERSONA_CONFIG[persona].label}
            </button>
          ))}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pt-44 pb-32 px-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[85%] px-5 py-3.5 shadow-sm ${msg.role === 'user'
                  ? `bg-gradient-to-br ${PERSONA_CONFIG[activePersona].color} text-white rounded-2xl rounded-tr-sm`
                  : 'bg-white/10 backdrop-blur-md border border-white/5 text-gray-100 rounded-2xl rounded-tl-sm'
                  }`}
              >
                <MarkdownRenderer
                  content={msg.text}
                  // Typing effect only for specific conditions if needed, otherwise rely on MarkdownRenderer's internal
                  animate={msg.role === 'model' && msg.isTyping}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl rounded-tl-sm border border-white/5">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-6 left-4 right-4 z-30 flex flex-col gap-3">

        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PERSONA_CONFIG[activePersona].suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-white/15 active:bg-white/20 backdrop-blur-lg border border-white/10 rounded-full text-xs text-white/90 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-2 p-1.5 pl-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl ring-1 ring-white/5">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={`שאל את ה${PERSONA_CONFIG[activePersona].label}...`}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-white/30 text-base focus:outline-none disabled:opacity-50"
            autoFocus
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${inputValue.trim() ? `bg-gradient-to-r ${PERSONA_CONFIG[activePersona].color} text-white shadow-lg` : 'bg-white/10 text-white/30'
              }`}
            aria-label="שלח הודעה"
          >
            <div className={isLoading ? "animate-spin" : ""}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <SendIcon className="w-5 h-5 -rotate-45 ml-0.5" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantScreen;
