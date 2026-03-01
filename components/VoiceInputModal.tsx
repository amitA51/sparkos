import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as aiService from '../services/ai';
import { MicrophoneIcon, CloseIcon, SparklesIcon } from './icons';
import { ERRORS } from '../utils/errorMessages';
import { NlpResult, PersonalItem, PersonalItemType } from '../types';
import { useData } from '../src/contexts/DataContext';
import { useNavigation } from '../src/contexts/NavigationContext';

// --- Web Speech API Type Definitions ---
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: { readonly transcript: string; readonly confidence: number };
}

interface SpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/**
 * VoiceInputModal
 *
 * משודרג כך שהקלט הקולי עובר דרך אותו מנגנון AI חכם של SmartCapture:
 * - זיהוי דיבור → תמליל
 * - תמליל → smartParseInput (מחליט סוג פריט + Space + תאריך)
 * - הצגת preview לפני יצירה, עם כפתור "צור" / "ערוך טקסט"
 *
 * בכך גם קלט קולי וגם הקלדה רגילה משתמשים באותה "בינה מלאכותית שיודעת איפה לשים את זה".
 */

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VoiceStatus = 'idle' | 'listening' | 'processing' | 'success' | 'error' | 'unsupported';

/**
 * Status configuration - all status-based UI logic in one place
 * Replaces multiple switch/if chains with a declarative config
 */
const STATUS_CONFIG: Record<VoiceStatus, { text: string; buttonClass: string }> = {
  idle: {
    text: 'לחץ על המיקרופון, דבר חופשי, וה-AI ידע איפה לשים את זה',
    buttonClass: 'bg-[var(--accent-gradient)]',
  },
  listening: {
    text: 'מקשיב...',
    buttonClass: 'animate-pulse-deep',
  },
  processing: {
    text: 'AI מנתח את מה שאמרת...',
    buttonClass: 'bg-blue-500/50',
  },
  success: {
    text: 'נוסף בהצלחה!',
    buttonClass: 'bg-green-500/50',
  },
  error: {
    text: 'אירעה שגיאה',
    buttonClass: 'bg-red-500/50',
  },
  unsupported: {
    text: 'הדפדפן שלך לא תומך בזיהוי דיבור.',
    buttonClass: 'bg-gray-500/50',
  },
};

const VoiceInputModal: React.FC<VoiceInputModalProps> = ({ isOpen, onClose }) => {
  const { addPersonalItem, personalItems, spaces } = useData();
  const { navigate } = useNavigation();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<NlpResult | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef('');
  const finalTranscriptRef = useRef('');

  // Keep refs in sync with state
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);
  useEffect(() => {
    finalTranscriptRef.current = finalTranscript;
  }, [finalTranscript]);

  const resetState = () => {
    setStatus('idle');
    setTranscript('');
    setFinalTranscript('');
    setError('');
    setAiSuggestion(null);
  };

  const handleClose = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    resetState();
    onClose();
  }, [onClose]);

  /**
   * מנתח את הטקסט עם smartParseInput – כמו ב-SmartCaptureModal.
   * כאן ה-AI יודע:
   * - אם זה task / note / habit / idea
   * - באיזה Space לשים (suggestedSpaceId)
   * - את התאריך והעדיפות אם זה משימה
   */
  const analyzeWithAI = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setStatus('idle');
        setAiSuggestion(null);
        return;
      }

      setStatus('processing');
      setError('');
      try {
        const result = await aiService.smartParseInput(text, spaces, personalItems);
        setAiSuggestion(result);
        setStatus('idle');
      } catch (e: unknown) {
        console.error('Error processing voice input with smartParseInput:', e);
        setError('שגיאה בניתוח הטקסט.');
        setStatus('error');
      }
    },
    [spaces, personalItems]
  );

  const handleCreateFromSuggestion = useCallback(async () => {
    if (!aiSuggestion) return;

    // 🎯 OPTIMISTIC: Capture suggestion, show success and close immediately
    const savedSuggestion = { ...aiSuggestion };
    setStatus('success');

    const newItemData: Partial<PersonalItem> & { type: PersonalItemType; title: string } = {
      type: savedSuggestion.type as PersonalItemType,
      title: savedSuggestion.title,
      content: '',
      spaceId: savedSuggestion.suggestedSpaceId,
    };

    if (savedSuggestion.type === 'task') {
      newItemData.dueDate = savedSuggestion.dueDate;
      newItemData.priority = savedSuggestion.priority || 'medium';
    }

    if (savedSuggestion.type === 'habit') {
      newItemData.frequency = 'daily';
    }

    // Close immediately after showing success
    setTimeout(() => {
      handleClose();
      navigate(savedSuggestion.type === 'task' ? 'today' : 'library');
    }, 800);

    try {
      await addPersonalItem(newItemData);
    } catch (e) {
      console.error('Failed to create item from voice smart capture:', e);
      // DataContext handles rollback - item will disappear if save fails
    }
  }, [aiSuggestion, addPersonalItem, navigate, handleClose]);

  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setStatus('unsupported');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'he-IL';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setStatus('listening');
        setTranscript('');
        setFinalTranscript('');
        setError('');
        setAiSuggestion(null);
      };

      recognition.onresult = event => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result?.[0]?.transcript ?? '';
          if (result?.isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        setTranscript(interim);
        setFinalTranscript(prev => (final ? prev + final : prev));
      };

      recognition.onend = () => {
        // סיום ההאזנה – מפעילים את ה-AI על התמליל הסופי
        // Use refs to avoid stale closures without adding to dependencies
        const textToAnalyze = (finalTranscriptRef.current || transcriptRef.current).trim();
        if (textToAnalyze) {
          analyzeWithAI(textToAnalyze);
        } else {
          setStatus('idle');
        }
      };

      recognition.onerror = event => {
        console.error('Speech recognition error:', event.error);

        switch (event.error) {
          case 'no-speech':
          case 'audio-capture':
            setError(ERRORS.SPEECH.NO_SPEECH);
            break;
          case 'not-allowed':
            setError(ERRORS.SPEECH.NOT_ALLOWED);
            break;
          case 'network':
            setError(ERRORS.SPEECH.NETWORK);
            break;
          case 'parse-failed':
            setError(ERRORS.SPEECH.PARSE_FAILED);
            break;
          case 'unsupported':
            setError(ERRORS.SPEECH.UNSUPPORTED);
            break;
          default:
            setError(ERRORS.SPEECH.GENERIC);
        }
        setStatus('error');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, analyzeWithAI]); // Removed transcript dependencies

  const startListening = () => {
    if (recognitionRef.current && status !== 'listening') {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Could not start recognition:', e);
      }
    }
  };

  const getStatusContent = () => {
    // Special cases that override config
    if (status === 'error' && error) return error;
    if (status === 'idle' && aiSuggestion) return 'בדוק את ההצעה ויצור פריט אם מתאים';
    // Default: use config
    return STATUS_CONFIG[status].text;
  };

  const microphoneButtonClass = () => STATUS_CONFIG[status].buttonClass;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-modal-enter">
      <button onClick={handleClose} className="absolute top-6 right-6 text-muted hover:text-white">
        <CloseIcon className="w-8 h-8" />
      </button>

      <div className="flex flex-col items-center justify-center flex-grow text-center max-w-xl w-full">
        <button
          onClick={startListening}
          disabled={status === 'listening' || status === 'processing'}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${microphoneButtonClass()}`}
        >
          {status === 'processing' ? (
            <SparklesIcon className="w-12 h-12 text-white animate-spin" />
          ) : (
            <MicrophoneIcon className="w-12 h-12 text-white" />
          )}
        </button>

        <p className="text-xl text-white mt-6 min-h-[3rem]">
          {transcript || finalTranscript || 'התחל לדבר...'}
        </p>

        <p className="text-sm text-[var(--text-secondary)] mt-2 min-h-[1.5rem]">
          {getStatusContent()}
        </p>

        {aiSuggestion && (
          <div className="mt-6 w-full text-left bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-4 space-y-3">
            <p className="text-sm text-muted">הצעת AI:</p>
            <p className="text-lg font-bold text-white">{aiSuggestion.title}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="px-2 py-1 rounded-full bg-black/40">סוג: {aiSuggestion.type}</span>
              {aiSuggestion.dueDate && (
                <span className="px-2 py-1 rounded-full bg-black/40">
                  🗓️ {new Date(aiSuggestion.dueDate).toLocaleDateString('he-IL')}
                </span>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCreateFromSuggestion}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--accent-gradient)] text-white font-semibold"
              >
                צור פריט
              </button>
              <button
                onClick={() => {
                  // לאפשר למשתמש להעתיק/להמשיך לעריכה טקסטואלית במודאל Smart Capture (עתידי)
                  // לעת עתה רק סוגרים את המודאל ומשאירים את החוויה פשוטה.
                  handleClose();
                  navigate('add');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-secondary)] text-white font-semibold"
              >
                ערוך כטקסט
              </button>
            </div>
          </div>
        )}

        {error && !aiSuggestion && <p className="mt-4 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default VoiceInputModal;
