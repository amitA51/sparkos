import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, ShareIcon, RefreshIcon } from '../icons';

// ============================================================================
// Types
// ============================================================================

interface QuoteEntry {
  text: string;
  author: string;
  lang: 'he' | 'en';
}

// ============================================================================
// Quotes Database (50+ carefully curated quotes)
// ============================================================================

const QUOTES: QuoteEntry[] = [
  // Hebrew Quotes
  { text: 'אל תפחד מלהתקדם לאט, פחד רק מלעמוד במקום.', author: 'פתגם סיני', lang: 'he' },
  { text: 'כל מסע של אלף מילין מתחיל בצעד אחד.', author: 'לאו דזה', lang: 'he' },
  { text: 'אין דבר קבוע יותר מהזמני.', author: 'פתגם עברי', lang: 'he' },
  { text: 'מי שלא מנסה - לא נכשל, אבל גם לא מצליח.', author: 'פתגם עברי', lang: 'he' },
  { text: 'התחלה היא חצי מהעבודה.', author: 'אפלטון', lang: 'he' },
  { text: 'היום הוא היום הראשון מחייך החדשים.', author: 'אבי קסלר', lang: 'he' },
  { text: 'הדרך הטובה ביותר לנבא את העתיד היא ליצור אותו.', author: 'פיטר דרוקר', lang: 'he' },
  { text: 'לא מספיק להיות עסוק. גם נמלים עסוקות. השאלה היא: במה אנחנו עסוקים?', author: 'הנרי דיוויד ת\'ורו', lang: 'he' },
  { text: 'הצלחה היא לא סופית, כישלון הוא לא קטלני. האומץ להמשיך הוא מה שחשוב.', author: 'וינסטון צ\'רצ\'יל', lang: 'he' },
  { text: 'החיים הם מה שקורה לך בזמן שאתה עסוק בלתכנן דברים אחרים.', author: 'ג\'ון לנון', lang: 'he' },
  { text: 'אל תשפוט כל יום לפי מה שקצרת, אלא לפי מה שזרעת.', author: 'רוברט לואיס סטיבנסון', lang: 'he' },
  { text: 'אתה חייב לעשות את הדבר שאתה חושב שאתה לא יכול לעשות.', author: 'אלינור רוזוולט', lang: 'he' },
  { text: 'אם רוצים דבר שמעולם לא היה, צריך לעשות דבר שמעולם לא נעשה.', author: 'תומס ג\'פרסון', lang: 'he' },
  { text: 'הסוד של ההתקדמות הוא להתחיל.', author: 'מארק טוויין', lang: 'he' },
  { text: 'לימדו מאתמול, חיו את היום, קוו למחר.', author: 'אלברט איינשטיין', lang: 'he' },
  { text: 'כשהרוח לא נושבת, חתור.', author: 'פתגם לטיני', lang: 'he' },
  { text: 'אי אפשר לחצות את הים רק על ידי עמידה ובהייה במים.', author: 'רבינדרנט טגור', lang: 'he' },
  { text: 'מי שמזיז הרים מתחיל בלהזיז אבנים קטנות.', author: 'קונפוציוס', lang: 'he' },
  { text: 'בדרך אל ההצלחה, אין מעלית. צריך לעלות במדרגות.', author: 'זיג זיגלר', lang: 'he' },
  { text: 'אם אתה לא מוכן להסתכן במה שרגיל, תצטרך להסתפק ברגיל.', author: 'ג\'ים רון', lang: 'he' },
  { text: 'לעולם אל תוותר. היום קשה, מחר יהיה קשה יותר, אבל מחרתיים יהיה יפה.', author: 'ג\'ק מא', lang: 'he' },
  { text: 'תמיד נראה בלתי אפשרי עד שזה נעשה.', author: 'נלסון מנדלה', lang: 'he' },
  { text: 'אל תחכה. העיתוי לעולם לא יהיה מושלם.', author: 'נפוליאון היל', lang: 'he' },
  { text: 'הגבול היחיד להישגינו של מחר הם הספקות של היום.', author: 'פרנקלין רוזוולט', lang: 'he' },
  { text: 'שנה את המחשבות שלך ואתה משנה את העולם שלך.', author: 'נורמן וינסנט פיל', lang: 'he' },

  // English Quotes
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', lang: 'en' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', lang: 'en' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', lang: 'en' },
  { text: 'Strive not to be a success, but rather to be of value.', author: 'Albert Einstein', lang: 'en' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha', lang: 'en' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt', lang: 'en' },
  { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein', lang: 'en' },
  { text: 'What we achieve inwardly will change outer reality.', author: 'Plutarch', lang: 'en' },
  { text: 'Your time is limited. Don\'t waste it living someone else\'s life.', author: 'Steve Jobs', lang: 'en' },
  { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb', lang: 'en' },
  { text: 'The best way to predict the future is to create it.', author: 'Abraham Lincoln', lang: 'en' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn', lang: 'en' },
  { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi', lang: 'en' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', lang: 'en' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', lang: 'en' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky', lang: 'en' },
  { text: 'Hard work beats talent when talent doesn\'t work hard.', author: 'Tim Notke', lang: 'en' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama', lang: 'en' },
  { text: 'Don\'t count the days, make the days count.', author: 'Muhammad Ali', lang: 'en' },
  { text: 'Everything you\'ve ever wanted is on the other side of fear.', author: 'George Addair', lang: 'en' },
  { text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela', lang: 'en' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle', lang: 'en' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', lang: 'en' },
  { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', lang: 'en' },
  { text: 'Act as if what you do makes a difference. It does.', author: 'William James', lang: 'en' },
  { text: 'We are what we repeatedly do. Excellence is not an act, but a habit.', author: 'Aristotle', lang: 'en' },
  { text: 'The only person you are destined to become is the person you decide to be.', author: 'Ralph Waldo Emerson', lang: 'en' },
];

// ============================================================================
// Gradient Palette (rotates based on day)
// ============================================================================

const GRADIENTS = [
  'from-violet-500/20 via-purple-400/10 to-transparent',
  'from-emerald-500/20 via-teal-400/10 to-transparent',
  'from-amber-500/20 via-orange-400/10 to-transparent',
  'from-sky-500/20 via-blue-400/10 to-transparent',
  'from-rose-500/20 via-pink-400/10 to-transparent',
  'from-indigo-500/20 via-blue-400/10 to-transparent',
  'from-cyan-500/20 via-teal-400/10 to-transparent',
];

// ============================================================================
// Helpers
// ============================================================================

/** Deterministic "random" based on date seed */
function seededIndex(seed: number, max: number): number {
  // Simple hash-like function using the seed
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return Math.floor((x - Math.floor(x)) * max);
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getTodayQuote(): QuoteEntry {
  const dayOfYear = getDayOfYear();
  const index = seededIndex(dayOfYear, QUOTES.length);
  return QUOTES[index] ?? QUOTES[0]!;
}

function getTodayGradient(): string {
  const dayOfYear = getDayOfYear();
  return GRADIENTS[dayOfYear % GRADIENTS.length] ?? GRADIENTS[0]!;
}

// ============================================================================
// Component
// ============================================================================

const DailyQuoteWidget: React.FC = () => {
  const [refreshSeed, setRefreshSeed] = useState(0);

  const quote = useMemo(() => {
    if (refreshSeed === 0) return getTodayQuote();
    // Manual refresh: pick a different quote
    const index = seededIndex(getDayOfYear() + refreshSeed, QUOTES.length);
    return QUOTES[index] ?? QUOTES[0]!;
  }, [refreshSeed]);

  const gradient = useMemo(() => {
    if (refreshSeed === 0) return getTodayGradient();
    return GRADIENTS[(getDayOfYear() + refreshSeed) % GRADIENTS.length] ?? GRADIENTS[0]!;
  }, [refreshSeed]);

  const isHebrew = quote.lang === 'he';

  const handleShare = useCallback(async () => {
    const shareText = `"${quote.text}"\n-- ${quote.author}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ציטוט מעורר השראה',
          text: shareText,
        });
      } catch {
        // User cancelled share -- no action needed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  }, [quote]);

  const handleRefresh = useCallback(() => {
    setRefreshSeed(prev => prev + 1);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="spark-card relative overflow-hidden"
    >
      {/* Dynamic gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--dynamic-accent-start,#8b5cf6)] via-[var(--dynamic-accent-end,#06b6d4)] to-transparent opacity-60" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--dynamic-accent-color)] border border-white/10 flex items-center justify-center">
              <SparklesIcon
                className="w-5 h-5"
                style={{ color: 'var(--dynamic-accent-start)' }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                ציטוט יומי
              </h3>
              <p className="text-xs text-theme-secondary">
                {isHebrew ? 'עברית' : 'English'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
              title="שתף"
            >
              <ShareIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors"
              title="ציטוט אחר"
            >
              <RefreshIcon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${quote.text}-${refreshSeed}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Decorative quotation mark */}
            <div className="absolute -right-2 top-14 text-[100px] leading-none font-serif text-white/[0.03] select-none pointer-events-none">
              {isHebrew ? '״' : '\u201C'}
            </div>

            <blockquote
              className="relative"
              dir={isHebrew ? 'rtl' : 'ltr'}
            >
              <p
                className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-4"
                style={{
                  fontFamily: isHebrew
                    ? 'inherit'
                    : 'Georgia, "Times New Roman", serif',
                }}
              >
                {quote.text}
              </p>

              <footer className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[var(--dynamic-accent-start,#8b5cf6)] to-[var(--dynamic-accent-end,#06b6d4)] rounded-full" />
                <cite className="not-italic text-sm font-medium text-white/80">
                  {quote.author}
                </cite>
              </footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] text-theme-muted">
            <span>מתחלף כל יום</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--dynamic-accent-start,#8b5cf6)] animate-pulse" />
              {QUOTES.length} ציטוטים
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(DailyQuoteWidget);
