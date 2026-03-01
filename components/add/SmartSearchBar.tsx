import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AddableType } from '../../types';
import { SparklesIcon, MicrophoneIcon, CloseIcon } from '../icons';
import { useHaptics } from '../../hooks/useHaptics';
import { toDateKey, todayKey } from '../../utils/dateUtils';
import { isAiAvailable, ai } from '../../services/ai/geminiClient';
import { Type } from '@google/genai';
import { loadSettings } from '../../services/settingsService';

interface SmartSearchBarProps {
  onCreateItem: (type: AddableType, data?: Record<string, unknown>) => void;
  onVoiceInput: () => void;
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
}

interface ParsedIntent {
  type: AddableType;
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  confidence: number;
  isAiResult?: boolean;
}

// Debounce time for AI calls (longer to avoid excessive API calls)
const AI_DEBOUNCE_MS = 800;

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  onCreateItem,
  onVoiceInput,
  isExpanded,
  onToggleExpand,
}) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<ParsedIntent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiAbortRef = useRef<AbortController | null>(null);
  const { triggerHaptic } = useHaptics();

  const parseIntent = useCallback((text: string): ParsedIntent[] => {
    if (!text.trim()) return [];

    const lowerText = text.toLowerCase();
    const results: ParsedIntent[] = [];

    // Helper to check keywords
    const hasKeywords = (keywords: string[]) => keywords.some(kw => lowerText.includes(kw));

    // 1. Detect Time/Date (Simple regex for now)
    const timeRegex = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
    const timeMatch = text.match(timeRegex);
    const dueTime = timeMatch ? timeMatch[0] : undefined;

    const tomorrow = hasKeywords(['tomorrow', 'מחר']);
    const today = hasKeywords(['today', 'היום']);
    const nextWeek = hasKeywords(['next week', 'שבוע הבא']);

    let dueDate: string | undefined;
    const now = new Date();
    if (tomorrow) {
      const tomorrowDate = new Date(now);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      dueDate = toDateKey(tomorrowDate);
    } else if (today) {
      dueDate = todayKey();
    } else if (nextWeek) {
      const nextWeekDate = new Date(now);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      dueDate = toDateKey(nextWeekDate);
    }

    const isImportant = hasKeywords(['important', 'urgent', 'חשוב', 'דחוף']);
    const priority = isImportant ? 'high' : 'medium';

    // Cleanup title - remove time/date keywords
    const title = text
      .replace(timeRegex, '')
      .replace(/\b(tomorrow|today|next week|important|urgent|מחר|היום|שבוע הבא|חשוב|דחוף)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 2. Classify based on Keywords

    // START: Classification Logic
    // Additional heuristics: starts with verb like "buy", "call" -> task

    // Workout
    if (
      hasKeywords([
        'workout',
        'gym',
        'run',
        'exercise',
        'train',
        'fit',
        'אימון',
        'ספורט',
        'חדר כושר',
        'לרוץ',
        'ריצה',
        'יוגה',
        'משקולות',
        'הליכה',
        'שחייה',
      ])
    ) {
      results.push({ type: 'workout', title, confidence: 0.95 });
    }

    // Task
    if (
      hasKeywords([
        'task',
        'todo',
        'do',
        'buy',
        'call',
        'email',
        'remind',
        'משימה',
        'לעשות',
        'צריך',
        'לקנות',
        'להתקשר',
        'לשלוח',
        'לבצע',
        'להזמין',
        'לנקות',
        'לסדר',
      ])
    ) {
      results.push({
        type: 'task',
        title,
        dueDate,
        dueTime,
        priority: priority as 'low' | 'medium' | 'high',
        confidence: 0.9,
      });
    }

    // Note
    if (
      hasKeywords(['note', 'write', 'remember', 'פתק', 'הערה', 'לכתוב', 'תזכורת', 'לרשום', 'ציטוט'])
    ) {
      results.push({ type: 'note', title, confidence: 0.85 });
    }

    // Idea
    if (hasKeywords(['idea', 'thought', 'think', 'רעיון', 'מחשבה', 'המצאה', 'אולי'])) {
      results.push({ type: 'idea', title, confidence: 0.9 });
    }

    // Book
    if (hasKeywords(['book', 'read', 'ספר', 'לקרוא', 'קריאה'])) {
      results.push({ type: 'book', title, confidence: 0.95 });
    }

    // Learning
    if (hasKeywords(['learn', 'study', 'course', 'research', 'ללמוד', 'קורס', 'מחקר', 'ידע'])) {
      results.push({ type: 'learning', title, confidence: 0.9 });
    }

    // Habit
    if (hasKeywords(['habit', 'routine', 'daily', 'הרגל', 'שגרה', 'כל יום', 'באופן קבוע'])) {
      results.push({ type: 'habit', title, confidence: 0.9 });
    }

    // Link
    if (hasKeywords(['http', 'www.', '.com', '.co.il', 'link', 'קישור', 'אתר'])) {
      results.push({ type: 'link', title, confidence: 0.95 });
    }

    // Goal/Project
    if (hasKeywords(['goal', 'project', 'target', 'יעד', 'מטרה', 'פרויקט'])) {
      results.push({ type: 'goal', title, confidence: 0.9 });
    }

    // Journal
    if (hasKeywords(['journal', 'diary', 'יומן', 'יומני'])) {
      results.push({ type: 'journal', title, confidence: 0.95 });
    }

    // Gratitude
    if (hasKeywords(['gratitude', 'thanks', 'thankful', 'תודה', 'הכרת תודה', 'מודה'])) {
      results.push({ type: 'gratitude', title, confidence: 0.95 });
    }

    // Ticker
    if (hasKeywords(['stock', 'ticker', 'crypto', 'coin', 'מניה', 'בורסה', 'מטבע', '$'])) {
      results.push({ type: 'ticker', title, confidence: 0.95 });
    }

    // Roadmap
    if (hasKeywords(['roadmap', 'plan', 'milestone', 'מפת דרכים', 'תוכנית', 'אבני דרך'])) {
      results.push({ type: 'roadmap', title, confidence: 0.9 });
    }

    // Default Fallback: If no specific type matched, suggest Task and Note as generic options
    if (results.length === 0) {
      // If it looks like a question or long text, maybe Note/Idea.
      // If short and imperative, Task.

      // Default primary suggestion: Note (safest)
      results.push({
        type: 'note',
        title: text,
        confidence: 0.6,
      });

      // Secondary: Task (if user intended action)
      results.push({
        type: 'task',
        title: text,
        confidence: 0.5,
      });

      // Tertiary: Spark (Generic)
      results.push({
        type: 'spark',
        title: text,
        confidence: 0.4,
      });
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }, []);

  // AI-powered parsing for smarter classification
  const parseWithAI = useCallback(async (text: string): Promise<ParsedIntent | null> => {
    if (!ai || !isAiAvailable()) return null;

    const settings = loadSettings();
    const today = todayKey();

    // Create a prompt specifically for the Add screen classification
    const prompt = `אתה עוזר חכם לסיווג פריטים באפליקציית פרודוקטיביות בעברית.

התאריך של היום: ${today}

סווג את הקלט הבא לאחד הסוגים:
- task: משימה (לעשות משהו, לקנות, להתקשר, וכו')
- note: פתק או הערה כללית
- habit: הרגל יומי או שגרה
- idea: רעיון חדש או מחשבה
- learning: למידה, לימוד, קורס, מחקר
- workout: אימון, ספורט, פעילות גופנית
- book: ספר לקריאה
- journal: יומן אישי, רשומה יומית
- goal: מטרה או פרויקט
- link: קישור או אתר

הכללים:
1. זהה את הסוג המתאים ביותר
2. חלץ את הכותרת הנקייה (ללא מילות הסוג כמו "למדתי", "אימון", וכו')
3. אם יש תאריך יחסי (מחר, היום, וכו'), המר אותו

דוגמאות:
"למדתי על ביטוח" → type: learning, title: "ביטוח"
"אימון גב" → type: workout, title: "גב"
"צריך לקנות חלב מחר" → type: task, title: "לקנות חלב", dueDate: תאריך מחר
"רעיון לאפליקציה חדשה" → type: idea, title: "אפליקציה חדשה"

הקלט: "${text}"`;

    try {
      const response = await ai.models.generateContent({
        model: settings.aiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                enum: [
                  'task',
                  'note',
                  'habit',
                  'idea',
                  'learning',
                  'workout',
                  'book',
                  'journal',
                  'goal',
                  'link',
                  'spark',
                ],
              },
              title: { type: Type.STRING },
              dueDate: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            },
            required: ['type', 'title'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) return null;

      const parsed = JSON.parse(responseText) as {
        type: AddableType;
        title: string;
        dueDate?: string;
        priority?: 'low' | 'medium' | 'high';
      };

      return {
        type: parsed.type,
        title: parsed.title,
        dueDate: parsed.dueDate,
        priority: parsed.priority,
        confidence: 1.0,
        isAiResult: true,
      };
    } catch (error) {
      console.error('AI parsing error:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Cancel any pending AI request
    if (aiAbortRef.current) {
      aiAbortRef.current.abort();
      aiAbortRef.current = null;
    }

    if (!input.trim()) {
      setSuggestions([]);
      setIsAiLoading(false);
      return;
    }

    // First, show quick local results
    setIsAnalyzing(true);
    const localResults = parseIntent(input);

    // If there's a high-confidence local match, show it immediately
    if (localResults.length > 0 && localResults[0] && localResults[0].confidence >= 0.9) {
      setSuggestions(localResults.slice(0, 2)); // Show only top 2 suggestions
      setSelectedIndex(0);
      setIsAnalyzing(false);
    } else {
      setSuggestions(localResults.slice(0, 3));
      setSelectedIndex(0);
      setIsAnalyzing(false);
    }

    // Then, try AI for better results (with debounce)
    if (isAiAvailable() && input.length >= 3) {
      setIsAiLoading(true);

      const aiTimeout = setTimeout(async () => {
        const aiResult = await parseWithAI(input);

        if (aiResult) {
          // AI result: show only this one (with optional second local suggestion)
          const secondSuggestion = localResults.find(r => r.type !== aiResult.type);
          const newSuggestions = [aiResult];
          if (secondSuggestion && secondSuggestion.confidence > 0.5) {
            newSuggestions.push({ ...secondSuggestion, confidence: 0.7 });
          }
          setSuggestions(newSuggestions);
          setSelectedIndex(0);
        }
        setIsAiLoading(false);
      }, AI_DEBOUNCE_MS);

      return () => {
        clearTimeout(aiTimeout);
        setIsAiLoading(false);
      };
    }

    return undefined;
  }, [input, parseIntent, parseWithAI]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
      triggerHaptic('light');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      triggerHaptic('light');
    } else if (e.key === 'Enter' && suggestions[selectedIndex]) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInput('');
      setSuggestions([]);
      onToggleExpand(false);
    }
  };

  const handleSelectSuggestion = (suggestion: ParsedIntent) => {
    triggerHaptic('medium');
    const { type, title, ...data } = suggestion;
    onCreateItem(type, { title, ...data });
    setInput('');
    setSuggestions([]);
    onToggleExpand(false);
  };

  const getTypeLabel = (type: AddableType): string => {
    const labels: Record<AddableType, string> = {
      spark: 'ספארק',
      task: 'משימה',
      note: 'פתק',
      link: 'קישור',
      idea: 'רעיון',
      habit: 'הרגל',
      book: 'ספר',
      workout: 'אימון',
      goal: 'פרויקט',
      journal: 'יומן',
      learning: 'למידה',
      roadmap: 'מפת דרכים',
      ticker: 'מניה/מטבע',
      gratitude: 'הכרת תודה',
      antigoal: 'אנטי-יעד',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: AddableType): string => {
    const colors: Record<AddableType, string> = {
      spark: 'from-cyan-500 to-violet-500',
      task: 'from-emerald-500 to-green-600',
      note: 'from-amber-500 to-yellow-500',
      link: 'from-blue-400 to-blue-600',
      idea: 'from-yellow-400 to-amber-500',
      habit: 'from-pink-500 to-rose-500',
      book: 'from-purple-400 to-violet-500',
      workout: 'from-pink-500 to-fuchsia-600',
      goal: 'from-teal-400 to-cyan-500',
      journal: 'from-fuchsia-400 to-pink-500',
      learning: 'from-sky-400 to-blue-500',
      roadmap: 'from-blue-500 to-indigo-600',
      ticker: 'from-gray-400 to-gray-600',
      gratitude: 'from-amber-500 to-orange-500',
      antigoal: 'from-red-500 to-red-700',
    };
    return colors[type] || 'from-cyan-500 to-violet-500';
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 mb-6">
      <div
        className={`relative transition-all duration-300 ease-out-expo ${isExpanded ? 'scale-100' : 'scale-95'
          }`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300 ${isExpanded
              ? 'bg-white/10 border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]'
              : 'bg-white/5 border border-white/10 shadow-lg'
            }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-300 ${isExpanded ? 'opacity-100 animate-gradient-flow' : ''
              }`}
            style={{
              backgroundSize: '200% 200%',
            }}
          />

          <div className="relative flex items-center gap-3 p-4">
            <div
              className={`flex-shrink-0 transition-all duration-300 ${isAnalyzing ? 'animate-pulse-glow' : ''
                }`}
            >
              <SparklesIcon
                className={`w-6 h-6 transition-all duration-300 ${isExpanded
                    ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                    : 'text-white/40'
                  }`}
              />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => onToggleExpand(true)}
              onKeyDown={handleKeyDown}
              placeholder="תאר מה תרצה ליצור..."
              className="flex-1 bg-transparent text-white placeholder-white/40 text-base font-medium focus:outline-none"
              autoComplete="off"
              dir="auto"
            />

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onVoiceInput();
                }}
                className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all active:scale-95 group relative overflow-hidden"
                aria-label="קלט קולי"
              >
                <MicrophoneIcon className="w-5 h-5 relative z-10" />
                <span className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-75 transition-opacity rounded-xl animate-ping" />
              </button>

              {input && (
                <button
                  onClick={() => {
                    setInput('');
                    setSuggestions([]);
                    triggerHaptic('light');
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all active:scale-95"
                  aria-label="נקה"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {suggestions.length > 0 && isExpanded && (
            <div className="border-t border-white/10 bg-black/20 backdrop-blur-md">
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full text-right p-3 rounded-xl transition-all duration-200 group ${index === selectedIndex
                        ? 'bg-white/15 scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`flex-shrink-0 px-3 py-1 rounded-lg bg-gradient-to-r ${getTypeColor(
                          suggestion.type
                        )} text-white text-xs font-bold shadow-lg`}
                      >
                        {getTypeLabel(suggestion.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate" dir="auto">
                          {suggestion.title}
                        </div>
                        {(suggestion.dueDate || suggestion.dueTime || suggestion.priority) && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                            {suggestion.dueDate && <span>📅 {suggestion.dueDate}</span>}
                            {suggestion.dueTime && <span>🕐 {suggestion.dueTime}</span>}
                            {suggestion.priority === 'high' && (
                              <span className="text-red-400">⚠️ חשוב</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-1">
                        {suggestion.isAiResult ? (
                          <span className="text-xs text-cyan-400 flex items-center gap-1">
                            <SparklesIcon className="w-3 h-3" />
                            AI
                          </span>
                        ) : (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full transition-all ${i < Math.floor(suggestion.confidence * 3)
                                  ? 'bg-cyan-400 shadow-[0_0_4px_rgba(0,240,255,0.6)]'
                                  : 'bg-white/20'
                                }`}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-white/5 bg-black/30">
                <div className="flex items-center justify-center gap-4 text-xs text-white/40">
                  <span>↑↓ לניווט</span>
                  <span>Enter לבחירה</span>
                  <span>Esc לסגירה</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Removed example hint for cleaner look */}
    </div>
  );
};

export default SmartSearchBar;
