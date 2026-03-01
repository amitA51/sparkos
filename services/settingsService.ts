import type { AppSettings, HomeScreenComponent, ThemeSettings, AddableType } from '../types';
import { LOCAL_STORAGE_KEYS as LS } from '../constants';

// Premium Theme Collection - $100M Quality with Stunning Gradients
const defaultThemes: Record<string, ThemeSettings> = {
  // 🌑 Obsidian Air - Apple Premium Aesthetics
  obsidianAir: {
    name: 'Obsidian Air',
    accentColor: '#FFFFFF',
    font: 'inter',
    cardStyle: 'glass',
    backgroundEffect: 'ambient-mesh',
    borderRadius: '2xl',
    gradientStart: '#FFFFFF',
    gradientEnd: '#E5E5E5',
    glowColor: '#FFFFFF',
    secondaryAccent: '#FFFFFF',
  },
  // 🌌 Nebula - Holographic Void
  nebula: {
    name: 'Nebula',
    accentColor: '#7F00FF',
    font: 'satoshi',
    cardStyle: 'glass',
    backgroundEffect: 'aurora-flow',
    borderRadius: 'xl',
    gradientStart: '#7F00FF',
    gradientEnd: '#00D1FF',
    glowColor: '#00D1FF',
    secondaryAccent: '#7F00FF',
  },
  // 🌌 Aurora Borealis - Ethereal Northern Lights
  aurora: {
    name: 'Aurora Borealis',
    accentColor: '#4ADE80',
    font: 'satoshi',
    cardStyle: 'glass',
    backgroundEffect: 'aurora-flow',
    borderRadius: 'xl',
    gradientStart: '#22D3EE',
    gradientEnd: '#4ADE80',
    glowColor: '#22D3EE',
    secondaryAccent: '#A78BFA',
  },

  // 🌅 Sunset Glow - Warm California Vibes
  sunset: {
    name: 'Sunset Glow',
    accentColor: '#FB923C',
    font: 'clash-display',
    cardStyle: 'glass',
    backgroundEffect: 'ambient-mesh',
    borderRadius: 'lg',
    gradientStart: '#F472B6',
    gradientEnd: '#FB923C',
    glowColor: '#FB923C',
    secondaryAccent: '#FBBF24',
  },

  // 🌊 Deep Ocean - Mysterious Depths
  ocean: {
    name: 'Deep Ocean',
    accentColor: '#22D3EE',
    font: 'marcelo',
    cardStyle: 'glass',
    backgroundEffect: 'silk-waves',
    borderRadius: 'lg',
    gradientStart: '#0EA5E9',
    gradientEnd: '#22D3EE',
    glowColor: '#0EA5E9',
    secondaryAccent: '#38BDF8',
  },

  // 🌸 Cherry Blossom - Japanese Elegance
  sakura: {
    name: 'Cherry Blossom',
    accentColor: '#F472B6',
    font: 'poppins',
    cardStyle: 'glass',
    backgroundEffect: 'particle-dust',
    borderRadius: 'xl',
    gradientStart: '#FB7185',
    gradientEnd: '#F9A8D4',
    glowColor: '#F472B6',
    secondaryAccent: '#FBBF24',
  },
  // ☀️ Minimal White - Clean Studio Light Mode
  minimalWhite: {
    name: 'Minimal White',
    accentColor: '#2563EB',
    font: 'inter',
    cardStyle: 'bordered',
    backgroundEffect: 'off',
    borderRadius: 'xl',
    gradientStart: '#EFF6FF',
    gradientEnd: '#DBEAFE',
    glowColor: '#60A5FA',
    secondaryAccent: '#0F172A',
  },

  // 💎 Diamond - Pure Luxury
  diamond: {
    name: 'Diamond',
    accentColor: '#E0E7FF',
    font: 'inter',
    cardStyle: 'bordered',
    backgroundEffect: 'dark',
    borderRadius: 'lg',
    gradientStart: '#C7D2FE',
    gradientEnd: '#F1F5F9',
    glowColor: '#818CF8',
    secondaryAccent: '#A5B4FC',
  },

  // 🔥 Ember - Fiery Passion
  ember: {
    name: 'Ember',
    accentColor: '#F87171',
    font: 'clash-display',
    cardStyle: 'flat',
    backgroundEffect: 'dark',
    borderRadius: 'md',
    gradientStart: '#EF4444',
    gradientEnd: '#FBBF24',
    glowColor: '#F87171',
    secondaryAccent: '#FB923C',
  },

  // 🌿 Forest - Natural Serenity
  forest: {
    name: 'Forest',
    accentColor: '#34D399',
    font: 'rubik',
    cardStyle: 'glass',
    backgroundEffect: 'particle-dust',
    borderRadius: 'lg',
    gradientStart: '#059669',
    gradientEnd: '#6EE7B7',
    glowColor: '#10B981',
    secondaryAccent: '#84CC16',
  },

  // 🌙 Moonlight - Gentle Night
  moonlight: {
    name: 'Moonlight',
    accentColor: '#A5B4FC',
    font: 'satoshi',
    cardStyle: 'glass',
    backgroundEffect: 'dark',
    borderRadius: 'xl',
    gradientStart: '#6366F1',
    gradientEnd: '#C7D2FE',
    glowColor: '#818CF8',
    secondaryAccent: '#DDD6FE',
  },

  // 🎭 Noir - Classic Elegance
  noir: {
    name: 'Noir',
    accentColor: '#FBBF24',
    font: 'inter',
    cardStyle: 'bordered',
    backgroundEffect: 'dark',
    borderRadius: 'md',
    gradientStart: '#F59E0B',
    gradientEnd: '#FDE047',
    glowColor: '#FBBF24',
    secondaryAccent: '#D4D4D8',
  },

  // 🦋 Morpho - Electric Blue
  morpho: {
    name: 'Morpho',
    accentColor: '#60A5FA',
    font: 'poppins',
    cardStyle: 'glass',
    backgroundEffect: 'aurora-flow',
    borderRadius: 'xl',
    gradientStart: '#3B82F6',
    gradientEnd: '#A78BFA',
    glowColor: '#60A5FA',
    secondaryAccent: '#C084FC',
  },

  // ✨ Stardust - Magical Sparkle
  stardust: {
    name: 'Stardust',
    accentColor: '#C084FC',
    font: 'satoshi',
    cardStyle: 'glass',
    backgroundEffect: 'particle-dust',
    borderRadius: 'xl',
    gradientStart: '#A855F7',
    gradientEnd: '#F472B6',
    glowColor: '#C084FC',
    secondaryAccent: '#FB7185',
  },

  // 💎 Spark - Default Blue (Default Theme)
  spark: {
    name: 'Spark',
    accentColor: '#0496c7',
    font: 'heebo',
    cardStyle: 'glass',
    backgroundEffect: 'dark',
    borderRadius: 'xl',
    gradientStart: '#0496c7',
    gradientEnd: '#06b6d4',
    glowColor: '#0496c7',
    secondaryAccent: '#38bdf8',
    fontWeight: 'medium',
  },

  // 🍇 Grape - Rich & Bold
  grape: {
    name: 'Grape',
    accentColor: '#A78BFA',
    font: 'marcelo',
    cardStyle: 'glass',
    backgroundEffect: 'dark',
    borderRadius: 'lg',
    gradientStart: '#7C3AED',
    gradientEnd: '#C4B5FD',
    glowColor: '#8B5CF6',
    secondaryAccent: '#DDD6FE',
  },
};

const defaultAddScreenLayout: AddableType[] = [
  'note',
  'workout',
  'roadmap',
  'learning',
  'idea',
  'book',
  'journal',
];

const defaultSettings: AppSettings = {
  userName: '',
  userEmoji: '👋',
  aiModel: 'gemini-2.0-flash',
  autoSummarize: false,

  themeSettings: defaultThemes.spark!,
  lastAddedType: 'task',
  addScreenLayout: defaultAddScreenLayout,
  uiDensity: 'comfortable',

  enabledMentorIds: [],

  screenLabels: {},

  homeScreenLayout: [
    { id: 'tasks', isVisible: true },
    { id: 'habits', isVisible: true },
    { id: 'quote_comfort_row', isVisible: true },
    { id: 'focus_timer', isVisible: true },
    { id: 'meditation', isVisible: true },
    { id: 'google_calendar', isVisible: true },
    { id: 'gratitude', isVisible: true },
  ],

  // New Personalization Settings
  hapticFeedback: true,
  soundEnabled: true,

  animationIntensity: 'default',
  fontSizeScale: 1.0,
  aiPersonality: 'encouraging',
  pomodoroSettings: {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4,
    autoStartNext: false,
  },
  aiFeedSettings: {
    isEnabled: true,
    topics: ['סייבר', 'פסיכולוגיה', 'כלכלה התנהגותית', 'שוק ההון', 'עסקים', 'פיננסים'],
    itemsPerRefresh: 3,
    customPrompt: '',
  },
  // Notification Settings
  notificationsEnabled: true,
  taskRemindersEnabled: true,
  taskReminderTime: 15,
  enableHabitReminders: true,

  // Swipe Settings
  swipeRightAction: 'complete',
  swipeLeftAction: 'postpone',

  workoutSettings: {
    defaultRestTime: 60,
    defaultSets: 3,
    soundEnabled: true,
    hapticsEnabled: true,
    keepAwake: true,
    oledMode: true,
    defaultWorkoutGoal: 'hypertrophy',
    enableWarmup: true,
    enableCooldown: true,
    warmupPreference: 'ask',
    cooldownPreference: 'ask',
    waterReminderEnabled: false,
    waterReminderInterval: 15,
    workoutRemindersEnabled: false,
    workoutReminderTime: '18:00',
    reminderDays: [],
    selectedTheme: 'deepCosmos',
    trackBodyWeight: true,
    // Display settings
    showGhostValues: true,
    showVolumePreview: true,
    showIntensityMeter: false,
    showPerformanceStats: false,
    compactMode: false,
    showSetHistory: true,
    // Timer settings
    autoStartRest: true,
    restTimerVibrate: true,
    restTimerSound: true,
    // Audio settings
    voiceCountdownEnabled: false,
    voiceLanguage: 'he-IL',
    voiceVolume: 0.8,
    countdownBeepEnabled: true,
    // Auto increment
    autoIncrementWeight: false,
    weightIncrementAmount: 2.5,
    // Accessibility
    reducedAnimations: false,
    largeText: false,
    highContrast: false,
    // === ADVANCED SETTINGS ===
    // Progressive Overload & Smart Features
    enableProgressiveOverload: true,
    progressiveOverloadPercent: 2.5,
    enableOneRepMaxTracking: true,
    showExerciseNotes: true,
    // Smart Rest Timer
    smartRestEnabled: false,
    shortRestTime: 60,
    mediumRestTime: 90,
    longRestTime: 180,
    extendRestAfterFailure: true,
    // Workout Flow
    autoAdvanceExercise: false,
    confirmExerciseComplete: true,
    enableSupersets: false,
    showRestBetweenExercises: true,
    // Personal Records
    enablePRAlerts: true,
    prCelebrationIntensity: 'full',
    trackVolumeRecords: true,
    // Data & Analytics
    enableWorkoutAnalytics: true,
    showMuscleGroupBalance: false,
    enableExportToCSV: true,
    // Timer Display
    timerDisplayMode: 'countdown',
    showTimerInHeader: true,
    // Quick Actions
    enableQuickWeightButtons: true,
    quickWeightIncrement: 2.5,
    enableQuickRepsButtons: true,
    // Gym Mode
    gymModeEnabled: false,
    gymModeAutoLock: false,
    // Body Weight Tracking
    promptWeightBeforeWorkout: false,
    promptWeightAfterWorkout: false,
  },

  // Cloud Sync
  autoSyncEnabled: true,
  syncFrequency: 15,

  // Visual Settings
  // Visual Settings
  visualSettings: {
    showStreaks: true,
    showProgressBars: true,
    enableCelebrations: true,
  },

  // Tooltip Settings


  // Extended Notification Settings
  dailyDigestEnabled: false,
  dailyDigestTime: '21:00',
  weeklyReviewEnabled: true,
  weeklyReviewDay: 0, // Sunday
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  celebrateCompletions: true,

  // 📅 Calendar Settings
  calendarSettings: {
    workingHoursEnabled: true,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
  },

  // ⏲️ Interval Timer Settings
  intervalTimerSettings: {
    restDuration: 60,
    workDuration: 30,
    autoStartNext: false,
  },

  sectionLabels: {
    'tasks': 'משימות',
    'habits': 'הרגלים',
    'quote': 'ציטוט יומי',
    'comfort_zone': 'יציאה מאזור הנוחות',
    'google_calendar': 'לוח שנה',
    'gratitude': 'הכרת תודה',
    'library': 'ספרייה',
    'meditation': 'מדיטציה',
  },

  // ✅ Task Settings
  taskSettings: {
    defaultPriority: 'medium',
    defaultDueTime: '09:00',
    autoScheduleOverdue: true,
    autoArchiveCompleted: false,
    autoArchiveDays: 14,
    sortCompletedToBottom: true,
    showTaskAge: false,
    enableNaturalLanguage: true,
    defaultListView: 'list',
  },

  // 🧠 Smart Features
  smartFeaturesSettings: {
    autoTagSuggestions: true,
    duplicateDetection: true,
    smartReschedule: false,
    aiWritingAssist: true,
    autoLinkDetection: true,
    markdownEnabled: true,
    autoBacklinks: false,
    smartReminders: true,
  },

  accessibilitySettings: {
    reduceMotion: false,
  },

  // 🔔 Consolidated Notification Settings
  notificationsSettings: {
    enabled: true,

    // Tasks
    taskRemindersEnabled: true,
    taskReminderMinutes: 15,

    // Habits
    habitRemindersEnabled: true,
    habitReminderTime: '09:00',

    // Calendar
    calendarRemindersEnabled: true,
    calendarReminderMinutes: 15,

    // Notes
    noteRemindersEnabled: true,

    // Digests
    dailyDigestEnabled: false,
    dailyDigestTime: '21:00',
    weeklyReviewEnabled: true,
    weeklyReviewDay: 0, // Sunday

    // Quiet Hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',

    // Celebrations
    celebrateCompletions: true,
  },

  // 🎨 Consolidated UI Settings
  uiSettings: {
    quickAddEnabled: true,
    defaultQuickAddType: 'task',
    showConfirmDialogs: true,
    hideQuickTemplates: false,
  },

  // 🔒 Privacy - REMOVED

  // 💾 Backup Settings
  backupSettings: {
    autoBackupEnabled: true,
    backupLocation: 'google_drive',
    backupRetentionDays: 30,
    includeAttachments: true,
  },

  // 📰 Feed Settings
  feedSettings: {
    markAsReadOnOpen: true,
    feedRefreshInterval: 30,
    defaultFeedSort: 'newest',
    autoSummarizeAI: false,
  },

  // 🔁 Habits Settings
  habitsSettings: {
    weeklyGoalDays: 5,
    showHabitStats: true,
    showMissedHabits: true,
  },

  // 🏠 Home Screen Settings
  homeSettings: {
    showGreeting: true,
    widgetSize: 'medium',
    showCalendarPreview: true,
    showWeatherWidget: false,
    quickActionsEnabled: true,
  },

  // ⏱️ Focus Goals
  focusGoalSettings: {
    dailyGoalMinutes: 120,
    autoStartNextSession: false,
    showFocusStats: true,
    longBreakInterval: 4,
    longBreakDuration: 30,
  },

  // 🎯 Comfort Zone Settings
  comfortZoneSettings: {
    useAiChallenges: true,  // ברירת מחדל: AI
    customChallenges: [],
  },
};

export { defaultSettings };

// Helper to merge layouts, keeping user's visibility but adding new components if they exist in default
const mergeLayouts = (
  userLayout: HomeScreenComponent[],
  defaultLayout: HomeScreenComponent[]
): HomeScreenComponent[] => {
  const userLayoutMap = new Map(userLayout.map(c => [c.id, c]));
  const result: HomeScreenComponent[] = [];

  // First, add all components from default layout (preserving user's visibility if they have it)
  for (const defaultComp of defaultLayout) {
    if (userLayoutMap.has(defaultComp.id)) {
      result.push(userLayoutMap.get(defaultComp.id)!);
    } else {
      // New component from default - add it with isVisible: true
      result.push({ ...defaultComp, isVisible: true });
    }
  }

  return result;
};

// Check if localStorage is available (handles private browsing mode)
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const loadSettings = (): AppSettings => {
  // Handle localStorage unavailability (e.g., private browsing)
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available, using default settings');
    return defaultSettings;
  }

  try {
    const storedSettings = localStorage.getItem(LS.SETTINGS);
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);



      // Migration from old show/hide toggles to new layout object
      if (parsed.showGratitude !== undefined && !parsed.homeScreenLayout) {
        parsed.homeScreenLayout = [
          { id: 'gratitude', isVisible: parsed.showGratitude },
          { id: 'habits', isVisible: parsed.showHabits },
          { id: 'tasks', isVisible: parsed.showTasks },
        ];
        // Clean up old properties
        delete parsed.showGratitude;
        delete parsed.showHabits;
        delete parsed.showTasks;
      }

      // MIGRATION: from simple theme string to ThemeSettings object
      if (typeof parsed.theme === 'string' && !parsed.themeSettings) {
        parsed.themeSettings =
          defaultThemes[parsed.theme as keyof typeof defaultThemes] || defaultThemes.spark;
        delete parsed.theme;
      }

      // MIGRATION: Consolidated Notifications
      if (!parsed.notificationsSettings) {
        parsed.notificationsSettings = {
          enabled: parsed.notificationsEnabled ?? true,
          taskRemindersEnabled: parsed.taskRemindersEnabled ?? true,
          taskReminderMinutes: parsed.taskReminderTime ?? 15,
          habitRemindersEnabled: parsed.enableHabitReminders ?? true,
          habitReminderTime: parsed.habitsSettings?.defaultReminderTime ?? "09:00",
          calendarRemindersEnabled: true,
          calendarReminderMinutes: parsed.calendarSettings?.defaultReminderTime ?? 15,
          dailyDigestEnabled: parsed.dailyDigestEnabled ?? false,
          dailyDigestTime: parsed.dailyDigestTime ?? "21:00",
          weeklyReviewEnabled: parsed.weeklyReviewEnabled ?? true,
          weeklyReviewDay: parsed.weeklyReviewDay ?? 0,
          quietHoursEnabled: parsed.quietHoursEnabled ?? false,
          quietHoursStart: parsed.quietHoursStart ?? "22:00",
          quietHoursEnd: parsed.quietHoursEnd ?? "07:00",
          celebrateCompletions: parsed.celebrateCompletions ?? true,
        };
      }

      // MIGRATION: Consolidated UI Settings
      if (!parsed.uiSettings) {
        parsed.uiSettings = {
          quickAddEnabled: parsed.quickAddEnabled ?? true,
          defaultQuickAddType: parsed.defaultQuickAddType ?? 'task',
          showConfirmDialogs: parsed.showConfirmDialogs ?? true,
          hideQuickTemplates: parsed.hideQuickTemplates ?? false,
        };
      }

      // MIGRATION: Ensure addScreenLayout contains all possible types for existing users
      if (parsed.addScreenLayout) {
        const userLayoutSet = new Set(parsed.addScreenLayout);
        const newItems = defaultAddScreenLayout.filter(item => !userLayoutSet.has(item));
        if (newItems.length > 0) {
          parsed.addScreenLayout = [...parsed.addScreenLayout, ...newItems];
        }
      }

      // MIGRATION: Rename 'המתכנן' to 'ספרייה' in screenLabels
      if (parsed.screenLabels?.library === 'המתכנן') {
        parsed.screenLabels.library = 'ספרייה';
      }

      // Merge with defaults to ensure new settings are applied
      return {
        ...defaultSettings,
        ...parsed,
        themeSettings: {
          ...defaultSettings.themeSettings,
          ...(parsed.themeSettings || defaultThemes.spark),
        },
        screenLabels: { ...defaultSettings.screenLabels, ...parsed.screenLabels },
        intervalTimerSettings: {
          ...defaultSettings.intervalTimerSettings,
          ...parsed.intervalTimerSettings,
        },
        sectionLabels: { ...defaultSettings.sectionLabels, ...parsed.sectionLabels },
        homeScreenLayout: parsed.homeScreenLayout
          ? mergeLayouts(parsed.homeScreenLayout, defaultSettings.homeScreenLayout)
          : defaultSettings.homeScreenLayout,

        enabledMentorIds: parsed.enabledMentorIds || [],
        pomodoroSettings: { ...defaultSettings.pomodoroSettings, ...parsed.pomodoroSettings },
        aiFeedSettings: { ...defaultSettings.aiFeedSettings, ...parsed.aiFeedSettings },
        visualSettings: { ...defaultSettings.visualSettings, ...parsed.visualSettings },
        // New settings mergers
        notificationsSettings: { ...defaultSettings.notificationsSettings, ...parsed.notificationsSettings },
        uiSettings: { ...defaultSettings.uiSettings, ...parsed.uiSettings },

        calendarSettings: { ...defaultSettings.calendarSettings, ...parsed.calendarSettings },
        taskSettings: { ...defaultSettings.taskSettings, ...parsed.taskSettings },
        smartFeaturesSettings: { ...defaultSettings.smartFeaturesSettings, ...parsed.smartFeaturesSettings },
        accessibilitySettings: { ...defaultSettings.accessibilitySettings, ...parsed.accessibilitySettings },
        backupSettings: { ...defaultSettings.backupSettings, ...parsed.backupSettings },
        // Additional settings mergers
        feedSettings: { ...defaultSettings.feedSettings, ...parsed.feedSettings },
        habitsSettings: { ...defaultSettings.habitsSettings, ...parsed.habitsSettings },
        homeSettings: { ...defaultSettings.homeSettings, ...parsed.homeSettings },
        focusGoalSettings: { ...defaultSettings.focusGoalSettings, ...parsed.focusGoalSettings },
        comfortZoneSettings: { ...defaultSettings.comfortZoneSettings, ...parsed.comfortZoneSettings },
      };
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    // Remove deprecated properties before saving using destructuring
    const {
      showGratitude: _g,
      showHabits: _h,
      showTasks: _t,
      theme: _theme,

      // Legacy notification fields
      notificationsEnabled: _ne,
      taskRemindersEnabled: _tre,
      taskReminderTime: _trt,
      enableHabitReminders: _ehr,
      dailyDigestEnabled: _dde,
      dailyDigestTime: _ddt,
      weeklyReviewEnabled: _wre,
      weeklyReviewDay: _wrd,
      quietHoursEnabled: _qhe,
      quietHoursStart: _qhs,
      quietHoursEnd: _qhe2,
      celebrateCompletions: _cc,

      // Legacy UI fields
      quickAddEnabled: _qae,
      defaultQuickAddType: _dqa,
      showConfirmDialogs: _scd,
      hideQuickTemplates: _hqt,

      ...settingsToSave
    } = settings as any;

    localStorage.setItem(LS.SETTINGS, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Failed to save settings to localStorage', error);
  }
};
