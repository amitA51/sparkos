/**
 * Settings Registry - Central searchable index for all settings
 * Maps settings to categories, keywords, and navigation targets
 */

import React from 'react';
import {
    UserIcon, SparklesIcon, HomeIcon,
    ClipboardListIcon, CalendarIcon, TargetIcon,
    BrainCircuitIcon, LightbulbIcon,
    TrendingUpIcon, BellIcon,
    LinkIcon, StarIcon
} from '../icons';

export interface SettingItem {
    id: string;
    title: string;
    description: string;
    keywords: string[]; // Hebrew + English search terms
    category: SettingsCategory;
    icon?: string;
    type: 'toggle' | 'select' | 'slider' | 'action' | 'link';
}

export type SettingsCategory =
    | 'profile'
    | 'appearance'
    | 'behavior'
    | 'interface'
    | 'focus'
    | 'workout'
    | 'ai'
    | 'sync'
    | 'data'
    | 'about'
    | 'notifications'
    | 'calendar'
    | 'tasks'
    | 'smart'
    | 'habits'
    | 'integrations'
    | 'feedback';

// Premium 6-group structure with user-centered naming
export type SettingsGroup = 'me' | 'experience' | 'do' | 'grow' | 'smart' | 'system';

// Group metadata for premium UI headers
export interface GroupInfo {
    id: SettingsGroup;
    emoji: string;
    title: string;
    subtitle: string;
    gradient: [string, string];
}

export const GROUPS: GroupInfo[] = [
    { id: 'me', emoji: '👤', title: 'אני', subtitle: 'הכל עליך והמראה שלך', gradient: ['#8B5CF6', '#A78BFA'] },
    { id: 'experience', emoji: '✨', title: 'חוויה', subtitle: 'איך האפליקציה מרגישה', gradient: ['#F59E0B', '#FBBF24'] },
    { id: 'do', emoji: '🚀', title: 'לעשות', subtitle: 'כלי הפרודוקטיביות שלך', gradient: ['#22C55E', '#4ADE80'] },
    { id: 'grow', emoji: '🌱', title: 'לצמוח', subtitle: 'הרגלים, יעדים ואתגרים', gradient: ['#EC4899', '#F472B6'] },
    { id: 'smart', emoji: '🧠', title: 'חכם', subtitle: 'בינה מלאכותית ותכונות חכמות', gradient: ['#06B6D4', '#22D3EE'] },
    { id: 'system', emoji: '⚙️', title: 'מערכת', subtitle: 'התראות, סנכרון ונתונים', gradient: ['#64748B', '#94A3B8'] },
];

export interface CategoryInfo {
    id: SettingsCategory;
    title: string;
    icon: React.ReactNode;
    gradient: [string, string];
    count: number;
    group: SettingsGroup;
}

export const CATEGORIES: CategoryInfo[] = [
    // 👤 אני (Me) - Everything about YOU
    { id: 'profile', title: 'פרופיל', icon: <UserIcon className="w-8 h-8 text-white" />, gradient: ['#8B5CF6', '#A78BFA'], count: 2, group: 'me' },
    { id: 'appearance', title: 'מראה ועיצוב', icon: <SparklesIcon className="w-8 h-8 text-white" />, gradient: ['#F59E0B', '#FBBF24'], count: 8, group: 'me' },

    // ✨ חוויה (Experience) - How it FEELS
    { id: 'interface', title: 'ממשק והתנהגות', icon: <HomeIcon className="w-8 h-8 text-white" />, gradient: ['#10B981', '#34D399'], count: 12, group: 'experience' },
    { id: 'feedback', title: 'צלילים ורטט', icon: <BellIcon className="w-8 h-8 text-white" />, gradient: ['#6366F1', '#818CF8'], count: 3, group: 'experience' },

    // 🚀 לעשות (Do) - Productivity
    { id: 'tasks', title: 'משימות', icon: <ClipboardListIcon className="w-8 h-8 text-white" />, gradient: ['#22C55E', '#4ADE80'], count: 9, group: 'do' },
    { id: 'calendar', title: 'לוח שנה', icon: <CalendarIcon className="w-8 h-8 text-white" />, gradient: ['#14B8A6', '#2DD4BF'], count: 5, group: 'do' },
    { id: 'focus', title: 'פוקוס ואימון', icon: <TargetIcon className="w-8 h-8 text-white" />, gradient: ['#EF4444', '#F87171'], count: 28, group: 'do' },

    // 🌱 לצמוח (Grow) - Growth & Habits
    { id: 'habits', title: 'הרגלים ואתגרים', icon: <TrendingUpIcon className="w-8 h-8 text-white" />, gradient: ['#EC4899', '#F472B6'], count: 6, group: 'grow' },

    // 🧠 חכם (Smart) - AI & Intelligence
    { id: 'ai', title: 'בינה מלאכותית', icon: <BrainCircuitIcon className="w-8 h-8 text-white" />, gradient: ['#06B6D4', '#22D3EE'], count: 5, group: 'smart' },
    { id: 'smart', title: 'תכונות חכמות', icon: <LightbulbIcon className="w-8 h-8 text-white" />, gradient: ['#A855F7', '#C084FC'], count: 8, group: 'smart' },

    // ⚙️ מערכת (System) - Technical
    { id: 'notifications', title: 'התראות', icon: <BellIcon className="w-8 h-8 text-white" />, gradient: ['#F59E0B', '#F97316'], count: 8, group: 'system' },
    { id: 'integrations', title: 'סנכרון ונתונים', icon: <LinkIcon className="w-8 h-8 text-white" />, gradient: ['#3B82F6', '#60A5FA'], count: 10, group: 'system' },
    { id: 'about', title: 'אודות', icon: <StarIcon className="w-8 h-8 text-white" />, gradient: ['#8B5CF6', '#C4B5FD'], count: 3, group: 'system' },
];

export const SETTINGS_REGISTRY: SettingItem[] = [
    // Profile
    { id: 'user-name', title: 'שם משתמש', description: 'השם שלך באפליקציה', keywords: ['שם', 'משתמש', 'name', 'user', 'profile'], category: 'profile', type: 'action' },
    { id: 'user-emoji', title: 'אימוג\'י', description: 'האימוג\'י שמייצג אותך', keywords: ['אימוג\'י', 'emoji', 'avatar', 'אווטר'], category: 'profile', type: 'action' },

    // Appearance
    { id: 'theme', title: 'ערכת נושא', description: 'בחר את העיצוב הכללי', keywords: ['ערכה', 'נושא', 'theme', 'עיצוב', 'צבע'], category: 'appearance', type: 'action' },
    { id: 'accent-color', title: 'צבע הדגשה', description: 'הצבע הראשי של האפליקציה', keywords: ['צבע', 'הדגשה', 'color', 'accent', 'ראשי'], category: 'appearance', type: 'action' },
    { id: 'font', title: 'גופן', description: 'סוג הפונט באפליקציה', keywords: ['גופן', 'פונט', 'font', 'טקסט'], category: 'appearance', type: 'select' },
    { id: 'font-size', title: 'גודל גופן', description: 'גודל הטקסט', keywords: ['גודל', 'גופן', 'font', 'size', 'טקסט'], category: 'appearance', type: 'slider' },
    { id: 'border-radius', title: 'עיצוב פינות', description: 'סגנון פינות הכרטיסים', keywords: ['פינות', 'עגול', 'radius', 'corners'], category: 'appearance', type: 'select' },
    { id: 'card-style', title: 'סגנון כרטיסים', description: 'מראה הרכיבים', keywords: ['כרטיס', 'סגנון', 'card', 'style', 'זכוכית'], category: 'appearance', type: 'select' },
    { id: 'background', title: 'רקע', description: 'אפקט הרקע', keywords: ['רקע', 'background', 'particles', 'חלקיקים'], category: 'appearance', type: 'select' },


    // Interface & Behavior
    { id: 'animations', title: 'אנימציות', description: 'עוצמת האנימציות', keywords: ['אנימציה', 'animation', 'תנועה', 'motion'], category: 'interface', type: 'select' },
    { id: 'density', title: 'צפיפות', description: 'צפיפות התצוגה', keywords: ['צפיפות', 'density', 'ריווח', 'spacing'], category: 'interface', type: 'select' },
    { id: 'reduce-motion', title: 'הפחת תנועה', description: 'צמצם אנימציות', keywords: ['תנועה', 'motion', 'reduce', 'אנימציה'], category: 'interface', type: 'toggle' },

    // Feedback (sounds & haptics)
    { id: 'sounds', title: 'צלילים', description: 'אפקטים קוליים', keywords: ['צליל', 'sound', 'קול', 'audio', 'סאונד'], category: 'feedback', type: 'toggle' },
    { id: 'haptics', title: 'רטט', description: 'משוב רטט בלחיצות', keywords: ['רטט', 'haptic', 'vibration', 'ויברציה'], category: 'feedback', type: 'toggle' },

    // Interface
    { id: 'swipe-actions', title: 'פעולות החלקה', description: 'הגדר פעולות סוויפ', keywords: ['החלקה', 'swipe', 'סוויפ', 'gesture'], category: 'interface', type: 'action' },
    { id: 'add-menu', title: 'תפריט הוספה', description: 'פריטים בתפריט הוספה', keywords: ['הוספה', 'add', 'menu', 'תפריט', 'יצירה'], category: 'interface', type: 'action' },
    { id: 'quick-add', title: 'כפתור הוספה מהירה', description: 'הצג כפתור צף להוספת פריטים', keywords: ['כפתור', 'button', 'float', 'add', 'הוספה', 'מהירה'], category: 'interface', type: 'toggle' },
    { id: 'default-quick-add', title: 'ברירת מחדל להוספה', description: 'פריט ברירת מחדל בלחיצה', keywords: ['ברירת', 'מחדל', 'default', 'add', 'click'], category: 'interface', type: 'select' },
    { id: 'quick-templates', title: 'תבניות מהירות', description: 'הצג תבניות במסך ההוספה', keywords: ['תבניות', 'templates', 'quick', 'add'], category: 'interface', type: 'toggle' },
    { id: 'confirm-dialogs', title: 'אישורי מחיקה', description: 'בקש אישור לפני מחיקה', keywords: ['אישור', 'confirm', 'delete', 'dialog'], category: 'interface', type: 'toggle' },

    // Focus
    { id: 'work-duration', title: 'זמן עבודה', description: 'משך סשן פוקוס', keywords: ['עבודה', 'work', 'זמן', 'duration', 'פומודורו'], category: 'focus', type: 'slider' },
    { id: 'break-duration', title: 'זמן הפסקה', description: 'משך ההפסקה', keywords: ['הפסקה', 'break', 'מנוחה', 'rest'], category: 'focus', type: 'slider' },
    { id: 'auto-start', title: 'התחלה אוטומטית', description: 'התחל סשן אוטומטית', keywords: ['אוטומטי', 'auto', 'start', 'התחלה'], category: 'focus', type: 'toggle' },


    // Workout (in focus category)
    { id: 'rest-timer', title: 'טיימר מנוחה', description: 'ברירת מחדל למנוחה', keywords: ['מנוחה', 'rest', 'טיימר', 'timer'], category: 'focus', type: 'slider' },
    { id: 'auto-rest', title: 'מנוחה אוטומטית', description: 'התחל מנוחה אוטומטית', keywords: ['מנוחה', 'אוטומטי', 'auto', 'rest'], category: 'focus', type: 'toggle' },
    { id: 'weight-unit', title: 'יחידת משקל', description: 'ק"ג או פאונד', keywords: ['משקל', 'weight', 'יחידה', 'unit', 'kg', 'lb'], category: 'focus', type: 'select' },
    { id: 'exercise-library', title: 'ספריית תרגילים', description: 'נהל תרגילים מותאמים', keywords: ['תרגיל', 'exercise', 'ספריה', 'library'], category: 'focus', type: 'action' },
    { id: 'warmup-cooldown', title: 'חימום וקירור', description: 'הגדרות חימום', keywords: ['חימום', 'warmup', 'קירור', 'cooldown'], category: 'focus', type: 'action' },
    { id: 'pr-alerts', title: 'התראות שיא', description: 'הודעה בשיא אישי', keywords: ['שיא', 'pr', 'record', 'התראה', 'alert'], category: 'focus', type: 'toggle' },
    { id: 'workout-history', title: 'היסטוריית אימונים', description: 'צפה באימונים קודמים', keywords: ['היסטוריה', 'history', 'אימון', 'workout'], category: 'focus', type: 'action' },
    
    // === NEW WORKOUT SETTINGS ===
    
    // Progressive Overload
    { id: 'progressive-overload', title: 'עלייה הדרגתית', description: 'מעקב והצעות להתקדמות', keywords: ['התקדמות', 'progressive', 'overload', 'עלייה'], category: 'focus', type: 'toggle' },
    { id: 'one-rep-max', title: 'מעקב 1RM', description: 'חישוב שיא משוער', keywords: ['1rm', 'שיא', 'max', 'מקסימום'], category: 'focus', type: 'toggle' },
    { id: 'show-ghost-values', title: 'ערכים קודמים', description: 'הצג ערכים מאימון קודם', keywords: ['ghost', 'קודם', 'previous', 'ערכים'], category: 'focus', type: 'toggle' },
    
    // Smart Rest Timer
    { id: 'smart-rest', title: 'מנוחה חכמה', description: 'התאם מנוחה לפי סוג תרגיל', keywords: ['חכם', 'smart', 'מנוחה', 'rest', 'adaptive'], category: 'focus', type: 'toggle' },
    { id: 'short-rest-time', title: 'מנוחה קצרה', description: 'זמן לתרגילי בידוד', keywords: ['קצר', 'short', 'מנוחה', 'בידוד'], category: 'focus', type: 'slider' },
    { id: 'medium-rest-time', title: 'מנוחה בינונית', description: 'זמן לתרגילים מורכבים', keywords: ['בינוני', 'medium', 'מנוחה', 'compound'], category: 'focus', type: 'slider' },
    { id: 'long-rest-time', title: 'מנוחה ארוכה', description: 'זמן להרמות כבדות', keywords: ['ארוך', 'long', 'מנוחה', 'heavy'], category: 'focus', type: 'slider' },
    
    // Workout Flow
    { id: 'auto-advance-exercise', title: 'מעבר אוטומטי', description: 'עבור לתרגיל הבא אוטומטית', keywords: ['אוטומטי', 'auto', 'advance', 'מעבר'], category: 'focus', type: 'toggle' },
    { id: 'enable-supersets', title: 'סופרסטים', description: 'אפשר קיבוץ תרגילים', keywords: ['superset', 'סופרסט', 'קיבוץ', 'combo'], category: 'focus', type: 'toggle' },
    
    // PR & Analytics
    { id: 'pr-celebration', title: 'חגיגת שיא', description: 'עוצמת אנימציית שיא', keywords: ['שיא', 'pr', 'חגיגה', 'celebration', 'אנימציה'], category: 'focus', type: 'select' },
    { id: 'track-volume-records', title: 'שיאי נפח', description: 'עקוב גם אחרי שיאי נפח', keywords: ['נפח', 'volume', 'שיא', 'record'], category: 'focus', type: 'toggle' },
    { id: 'workout-analytics', title: 'ניתוח אימונים', description: 'מעקב ביצועים מפורט', keywords: ['ניתוח', 'analytics', 'סטטיסטיקה', 'statistics'], category: 'focus', type: 'toggle' },
    
    // Quick Actions
    { id: 'quick-weight-buttons', title: 'כפתורי משקל מהירים', description: 'הצג +/- למשקל', keywords: ['מהיר', 'quick', 'משקל', 'כפתור'], category: 'focus', type: 'toggle' },
    { id: 'quick-weight-increment', title: 'קפיצת משקל', description: 'כמה להוסיף בכל לחיצה', keywords: ['increment', 'קפיצה', 'משקל', 'תוספת'], category: 'focus', type: 'slider' },
    
    // Gym Mode
    { id: 'gym-mode', title: 'מצב חדר כושר', description: 'מסך מלא לשימוש בחדר כושר', keywords: ['gym', 'חדר כושר', 'מסך מלא', 'fullscreen'], category: 'focus', type: 'toggle' },
    { id: 'gym-auto-lock', title: 'נעילת מסך', description: 'מנע נגיעות בטעות', keywords: ['נעילה', 'lock', 'מסך', 'touch'], category: 'focus', type: 'toggle' },
    
    // Voice & Audio
    { id: 'voice-countdown', title: 'ספירה קולית', description: 'הכרזה קולית על זמן מנוחה', keywords: ['קול', 'voice', 'ספירה', 'countdown', 'הכרזה'], category: 'focus', type: 'toggle' },
    { id: 'countdown-beep', title: 'צפצופי ספירה', description: 'צפצופים בשניות האחרונות', keywords: ['צפצוף', 'beep', 'ספירה', 'countdown'], category: 'focus', type: 'toggle' },
    
    // Body Weight
    { id: 'prompt-weight-before', title: 'שקילה לפני אימון', description: 'בקש משקל גוף לפני אימון', keywords: ['משקל', 'שקילה', 'לפני', 'before'], category: 'focus', type: 'toggle' },
    { id: 'prompt-weight-after', title: 'שקילה אחרי אימון', description: 'בקש משקל גוף אחרי אימון', keywords: ['משקל', 'שקילה', 'אחרי', 'after'], category: 'focus', type: 'toggle' },

    // AI
    { id: 'ai-enabled', title: 'הפעל AI', description: 'הפעל תכונות AI', keywords: ['ai', 'בינה', 'מלאכותית', 'artificial'], category: 'ai', type: 'toggle' },
    { id: 'ai-personality', title: 'אישיות AI', description: 'סגנון התקשורת', keywords: ['אישיות', 'personality', 'סגנון', 'style'], category: 'ai', type: 'select' },
    { id: 'ai-sparks', title: 'ספארקים AI', description: 'יצירת ספארקים אוטומטית', keywords: ['ספארק', 'spark', 'ai', 'אוטומטי'], category: 'ai', type: 'toggle' },

    // Integrations (merged sync + data)
    { id: 'cloud-sync', title: 'סנכרון ענן', description: 'סנכרון עם Google', keywords: ['סנכרון', 'sync', 'ענן', 'cloud', 'google'], category: 'integrations', type: 'action' },
    { id: 'google-tasks', title: 'Google Tasks', description: 'חיבור ל-Google Tasks', keywords: ['google', 'tasks', 'משימות', 'גוגל'], category: 'integrations', type: 'action' },
    { id: 'telegram-reminders', title: 'תזכורות קוליות בטלגרם', description: 'שלח תזכורות בהודעה קולית', keywords: ['טלגרם', 'telegram', 'תזכורת', 'קולי', 'voice', 'בוט', 'bot'], category: 'integrations', type: 'action' },
    { id: 'notifications-sync', title: 'התראות', description: 'הגדרות התראות', keywords: ['התראה', 'notification', 'push', 'הודעה'], category: 'integrations', type: 'toggle' },
    { id: 'webhooks', title: 'Webhooks', description: 'אינטגרציות חיצוניות', keywords: ['webhook', 'api', 'integration', 'אינטגרציה'], category: 'integrations', type: 'action' },

    // Data (in integrations)
    { id: 'export', title: 'ייצוא נתונים', description: 'גיבוי לקובץ', keywords: ['ייצוא', 'export', 'גיבוי', 'backup'], category: 'integrations', type: 'action' },
    { id: 'import', title: 'ייבוא נתונים', description: 'שחזור מקובץ', keywords: ['ייבוא', 'import', 'שחזור', 'restore'], category: 'integrations', type: 'action' },
    { id: 'password', title: 'סיסמה', description: 'הגדר סיסמת גיבוי', keywords: ['סיסמה', 'password', 'אבטחה', 'security'], category: 'integrations', type: 'action' },
    { id: 'delete-data', title: 'מחיקת נתונים', description: 'מחק את כל הנתונים', keywords: ['מחיקה', 'delete', 'איפוס', 'reset'], category: 'integrations', type: 'action' },

    // About
    { id: 'version', title: 'גרסה', description: 'מידע על הגרסה', keywords: ['גרסה', 'version', 'build'], category: 'about', type: 'link' },
    { id: 'changelog', title: 'מה חדש', description: 'עדכונים אחרונים', keywords: ['חדש', 'changelog', 'עדכון', 'update'], category: 'about', type: 'action' },
    { id: 'feedback', title: 'משוב', description: 'שלח משוב למפתחים', keywords: ['משוב', 'feedback', 'דירוג', 'rate'], category: 'about', type: 'action' },

    // 🔔 Notifications
    { id: 'push-notifications', title: 'התראות מערכת', description: 'הפעל/כבה התראות פוש', keywords: ['push', 'notification', 'התראה', 'פוש', 'master'], category: 'notifications', type: 'toggle' },
    { id: 'task-reminders', title: 'תזכורות משימות', description: 'התראות לפני יעד משימה', keywords: ['תזכורת', 'reminder', 'התראה', 'משימה'], category: 'notifications', type: 'toggle' },
    { id: 'habit-reminders', title: 'תזכורות הרגלים', description: 'תזכורות יומיות להרגלים', keywords: ['הרגל', 'habit', 'תזכורת', 'reminder'], category: 'notifications', type: 'toggle' },
    { id: 'calendar-reminders', title: 'תזכורות יומן', description: 'תזכורת לפני אירוע ביומן', keywords: ['יומן', 'calendar', 'reminder', 'תזכורת'], category: 'notifications', type: 'toggle' },
    { id: 'daily-digest', title: 'סיכום יומי', description: 'קבל סיכום יומי של המשימות', keywords: ['סיכום', 'יומי', 'digest', 'daily'], category: 'notifications', type: 'toggle' },
    { id: 'weekly-review', title: 'סקירה שבועית', description: 'סקירת התקדמות שבועית', keywords: ['שבועי', 'סקירה', 'weekly', 'review'], category: 'notifications', type: 'toggle' },
    { id: 'quiet-hours', title: 'שעות שקט', description: 'השתק התראות בזמנים מסוימים', keywords: ['שקט', 'quiet', 'dnd', 'אל תפריע'], category: 'notifications', type: 'toggle' },
    { id: 'celebrate', title: 'חגיגה בהשלמה', description: 'הצג אנימציה בהשלמת משימה', keywords: ['חגיגה', 'celebrate', 'confetti', 'אנימציה'], category: 'notifications', type: 'toggle' },

    // 📅 Calendar
    { id: 'working-hours', title: 'שעות עבודה', description: 'הגדר שעות עבודה', keywords: ['עבודה', 'work', 'hours', 'שעות'], category: 'calendar', type: 'action' },

    // ✅ Tasks
    { id: 'default-priority', title: 'עדיפות ברירת מחדל', description: 'עדיפות למשימות חדשות', keywords: ['עדיפות', 'priority', 'default'], category: 'tasks', type: 'select' },
    { id: 'default-due-time', title: 'שעת יעד', description: 'שעה ברירת מחדל למשימות', keywords: ['שעה', 'יעד', 'due', 'time'], category: 'tasks', type: 'action' },
    { id: 'auto-schedule', title: 'העבר באיחור להיום', description: 'העבר משימות באיחור להיום', keywords: ['איחור', 'overdue', 'auto', 'schedule'], category: 'tasks', type: 'toggle' },
    { id: 'auto-archive', title: 'ארכוב אוטומטי', description: 'ארכב משימות שהושלמו', keywords: ['ארכוב', 'archive', 'auto'], category: 'tasks', type: 'toggle' },
    { id: 'sort-completed', title: 'השלמות למטה', description: 'הזז משימות שהושלמו למטה', keywords: ['מיון', 'sort', 'completed', 'bottom'], category: 'tasks', type: 'toggle' },
    { id: 'show-task-age', title: 'גיל משימה', description: 'הצג כמה זמן המשימה פתוחה', keywords: ['גיל', 'age', 'זמן', 'time'], category: 'tasks', type: 'toggle' },
    { id: 'natural-language', title: 'שפה טבעית', description: 'פענח תאריכים מטקסט', keywords: ['שפה', 'natural', 'language', 'מחר', 'tomorrow'], category: 'tasks', type: 'toggle' },
    { id: 'default-view', title: 'תצוגת ברירת מחדל', description: 'תצוגה ראשונית של משימות', keywords: ['תצוגה', 'view', 'default', 'רשימה', 'קנבאן'], category: 'tasks', type: 'select' },

    // 🧠 Smart Features
    { id: 'auto-tags', title: 'הצעות תגיות', description: 'הצע תגיות בהתבסס על התוכן', keywords: ['תגית', 'tag', 'auto', 'suggest'], category: 'smart', type: 'toggle' },
    { id: 'duplicate-detection', title: 'זיהוי כפילויות', description: 'הזהר על פריטים דומים', keywords: ['כפול', 'duplicate', 'detect', 'similar'], category: 'smart', type: 'toggle' },
    { id: 'smart-reschedule', title: 'תזמון חכם', description: 'הצע זמנים טובים יותר', keywords: ['תזמון', 'reschedule', 'smart'], category: 'smart', type: 'toggle' },
    { id: 'ai-writing', title: 'עזרה בכתיבה', description: 'עזרת AI בכתיבת תוכן', keywords: ['כתיבה', 'writing', 'ai', 'assist'], category: 'smart', type: 'toggle' },
    { id: 'auto-links', title: 'זיהוי קישורים', description: 'הפוך קישורים אוטומטית', keywords: ['קישור', 'link', 'auto', 'detect'], category: 'smart', type: 'toggle' },
    { id: 'markdown', title: 'תמיכה ב-Markdown', description: 'הפעל עיצוב Markdown', keywords: ['markdown', 'md', 'עיצוב', 'format'], category: 'smart', type: 'toggle' },
    { id: 'backlinks', title: 'קישורים חוזרים', description: 'צור קישורים חוזרים אוטומטית', keywords: ['קישור', 'חוזר', 'backlink', 'obsidian'], category: 'smart', type: 'toggle' },





    // 📰 Feed (smart category - intelligent behavior)
    { id: 'mark-read-open', title: 'סמן כנקרא', description: 'סמן פריט כנקרא בפתיחה', keywords: ['קרא', 'read', 'open', 'פתיחה'], category: 'smart', type: 'toggle' },
    { id: 'feed-refresh', title: 'רענון פיד', description: 'תדירות רענון אוטומטי', keywords: ['רענון', 'refresh', 'פיד', 'feed'], category: 'smart', type: 'select' },
    { id: 'feed-sort', title: 'מיון פיד', description: 'מיון ברירת מחדל', keywords: ['מיון', 'sort', 'פיד', 'feed'], category: 'smart', type: 'select' },

    // 🔁 Habits (habits category)
    { id: 'habit-reminder', title: 'תזכורת הרגל', description: 'שעת תזכורת ברירת מחדל', keywords: ['הרגל', 'habit', 'תזכורת', 'reminder'], category: 'habits', type: 'action' },
    { id: 'habit-streak', title: 'רצף הרגלים', description: 'הצג מונה רצף ימים', keywords: ['רצף', 'streak', 'הרגל', 'habit'], category: 'habits', type: 'toggle' },
    { id: 'weekly-goal', title: 'יעד שבועי', description: 'ימי יעד בשבוע', keywords: ['יעד', 'שבוע', 'weekly', 'goal'], category: 'habits', type: 'slider' },
    { id: 'streaks', title: 'רצפים', description: 'הצג מונה ימים רצופים', keywords: ['רצף', 'streak', 'ימים', 'days'], category: 'habits', type: 'toggle' },

    // 🏠 Home (appearance category - visual preferences)
    { id: 'show-greeting', title: 'ברכה אישית', description: 'הצג ברכה במסך הבית', keywords: ['ברכה', 'greeting', 'בית', 'home'], category: 'appearance', type: 'toggle' },
    { id: 'widget-size', title: 'גודל ווידג\'טים', description: 'גודל ברירת מחדל לווידג\'טים', keywords: ['ווידג\'ט', 'widget', 'size', 'גודל'], category: 'appearance', type: 'select' },
    { id: 'calendar-preview', title: 'תצוגת לוח שנה', description: 'הצג אירועים קרובים', keywords: ['לוח', 'calendar', 'preview', 'אירועים'], category: 'appearance', type: 'toggle' },

    // ⏱️ Focus (focus category - keeping essential)
    { id: 'daily-focus-goal', title: 'יעד יומי', description: 'יעד פוקוס יומי (דקות)', keywords: ['יעד', 'goal', 'פוקוס', 'focus'], category: 'focus', type: 'slider' },
    { id: 'auto-next-session', title: 'התחל אוטומטית', description: 'התחל סשן הבא אוטומטית', keywords: ['אוטומטי', 'auto', 'session', 'סשן'], category: 'focus', type: 'toggle' },
    { id: 'long-break', title: 'הפסקה ארוכה', description: 'הפסקה ארוכה כל X סשנים', keywords: ['הפסקה', 'break', 'ארוך', 'long'], category: 'focus', type: 'select' },

    // 🎯 Challenges (habits category - for growth)
    { id: 'use-ai-challenges', title: 'אתגרים עם AI', description: 'צור אתגרים עם AI או בחר מרשימה אישית', keywords: ['ai', 'אתגר', 'challenge', 'נוחות', 'comfort'], category: 'habits', type: 'toggle' },
    { id: 'custom-challenges', title: 'אתגרים אישיים', description: 'נהל רשימת אתגרים אישית', keywords: ['אתגר', 'אישי', 'custom', 'challenge', 'רשימה'], category: 'habits', type: 'action' },
];

/**
 * Fuzzy search settings by query
 * Supports Hebrew and English, with typo tolerance
 */
export function searchSettings(query: string): SettingItem[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();

    return SETTINGS_REGISTRY.filter(setting => {
        // Check title
        if (setting.title.toLowerCase().includes(lowerQuery)) return true;
        // Check description
        if (setting.description.toLowerCase().includes(lowerQuery)) return true;
        // Check keywords
        if (setting.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))) return true;
        return false;
    }).slice(0, 10); // Limit results
}

/**
 * Get settings by category
 */
export function getSettingsByCategory(category: SettingsCategory): SettingItem[] {
    return SETTINGS_REGISTRY.filter(s => s.category === category);
}

/**
 * Get category info by id
 */
export function getCategoryInfo(id: SettingsCategory): CategoryInfo | undefined {
    return CATEGORIES.find(c => c.id === id);
}
