import { ITEM_TYPES, PERSONAL_ITEM_TYPES } from './constants';

// Re-export SparkItem types from dedicated types file
export * from './types/SparkItemTypes';

export type Screen =
  | 'feed'
  | 'search'
  | 'fitness'
  | 'add'
  | 'today'
  | 'library'
  | 'settings'
  | 'investments'
  | 'assistant'
  | 'dashboard'
  | 'calendar'
  | 'passwords'
  | 'views'
  | 'login'
  | 'signup'
  | 'logos';
export type ItemType = (typeof ITEM_TYPES)[number];
export type PersonalItemType = (typeof PERSONAL_ITEM_TYPES)[number];

// Split View configuration
export interface SplitViewConfig {
  isActive: boolean;
  left: Screen | 'dashboard';
  right: Screen | 'feed';
}

// User type for authentication
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Space {
  id: string;
  name: string;
  icon: string; // Icon identifier
  color: string; // Hex color or CSS variable
  type: 'personal' | 'feed';
  order: number;
  tags?: string[];
  category?: string;
  isPinned?: boolean;
}

// Smart Folder - Virtual folder that auto-populates based on filter criteria
export type SmartFolderFilterField =
  | 'type'
  | 'tags'
  | 'spaceId'
  | 'dueDate'
  | 'priority'
  | 'isCompleted'
  | 'createdAt'
  | 'isImportant'
  | 'isPinned';

export type SmartFolderFilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'before'
  | 'after'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'within'; // For relative dates like "within 7 days"

export interface SmartFolderFilter {
  field: SmartFolderFilterField;
  operator: SmartFolderFilterOperator;
  value: string | boolean | string[] | number;
}

export interface SmartFolder {
  id: string;
  name: string;
  nameHe?: string;
  icon: string;
  color: string;
  filters: SmartFolderFilter[];
  matchMode: 'all' | 'any'; // AND vs OR for multiple filters
  createdAt: string;
  updatedAt: string;
  order: number;
  isBuiltin?: boolean; // System-defined smart folders
}

export interface Attachment {
  id: string;
  name: string;
  type: 'drive' | 'local';
  url: string; // Google Drive link or Data URL for local file
  mimeType: string;
  size: number; // in bytes
}

export interface FeedItem {
  id: string;
  type: 'rss' | 'spark' | 'news' | 'mentor';
  title: string;
  link?: string;
  imageUrl?: string;
  content: string;
  summary_ai?: string;
  is_read: boolean;
  is_spark: boolean;
  isImportant?: boolean;
  tags: Tag[];
  createdAt: string;
  attachments?: Attachment[];
  source?: string; // e.g., 'BTC' for news, RSS feed ID, or mentor ID `mentor:jordan-peterson`
  insights?: string[];
  topics?: string[];
  level?: string;
  estimated_read_time_min?: number;
  source_trust_score?: number;
  digest?: string;
}

export type RssFeedCategory = 'economics' | 'tech' | 'news' | 'behavioral' | 'general';

export interface RssFeed {
  id: string;
  url: string;
  name: string;
  spaceId?: string;
  category?: RssFeedCategory;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  notes?: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restTime?: number; // Actual rest time taken in seconds
  completedAt?: string; // ISO timestamp when set was completed
  isWarmup?: boolean; // true = warmup set, not counted in working sets
}

export interface ProgramExerciseExtras {
  notes?: string;
  alternatives?: string[];
  rpeTarget?: string;
  warmupSets?: string;
  restTime?: string;
  intensityTechnique?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  targetRestTime?: number; // Target rest time in seconds (default: 90)
  muscleGroup?: string; // e.g., "Chest", "Back", "Legs"
  tempo?: string; // e.g., "3-0-1-0"
  notes?: string; // Exercise-level notes
  tutorialText?: string;
  programExtras?: ProgramExerciseExtras; // Program-specific data: RPE, alternatives, warmup, rest, intensity
  lastPerformed?: {
    date: string;
    sets: WorkoutSet[];
  };
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  createdAt: string;
  muscleGroups?: string[]; // e.g., ["Chest", "Triceps"]
  tags?: string[];
  isBuiltin?: boolean;
  lastUsed?: string; // ISO timestamp when template was last used
  useCount?: number; // How many times the template was used
}

// Personal Exercise Library - התרגילים האישיים של המשתמש
export interface PersonalExercise {
  id: string;
  name: string;
  muscleGroup?: string;
  category?: 'strength' | 'cardio' | 'flexibility' | 'warmup' | 'cooldown';
  tempo?: string; // e.g., "3-0-1-0"
  defaultRestTime?: number; // זמן מנוחה ברירת מחדל (שניות)
  defaultSets?: number; // מספר סטים ברירת מחדל
  notes?: string;
  createdAt: string;
  lastUsed?: string; // ISO timestamp
  useCount?: number; // כמה פעמים השתמשו בתרגיל
  tutorialText?: string;
  isFavorite?: boolean; // מועדף לבחירה מהירה
}

export interface WorkoutTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutItemId?: string; // Made optional if not always linked to a schedule item
  startTime: string;
  endTime?: string;
  duration?: number; // seconds
  volume?: number; // kg
  prs?: number; // count
  startWeight?: number; // in kg
  goalType?: WorkoutGoal;
  warmupCompleted?: boolean;
  cooldownCompleted?: boolean;
  exercises: Exercise[];
}

export interface BodyWeightEntry {
  id: string;
  date: string;
  weight: number; // kg
  notes?: string;
}

export interface FocusSession {
  date: string; // ISO date string
  duration: number; // in minutes
}

// --- NEW ROADMAP HIERARCHY ---

export interface SubTask {
  // Level 3: A simple sub-task for a parent task
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface RoadmapTask {
  // Level 2: An actionable task within a phase
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string; // ISO Date string
  order: number;
  subTasks?: SubTask[]; // Can have its own sub-tasks
}

export interface RoadmapPhase {
  // Level 1: A major stage or step in the roadmap
  id: string;
  title: string;
  description: string;
  duration: string; // Deprecated, but kept for old data. New logic uses dates.
  startDate: string; // ISO Date string 'YYYY-MM-DD'
  endDate: string; // ISO Date string 'YYYY-MM-DD'
  notes?: string;
  tasks: RoadmapTask[];
  order: number;
  attachments: Attachment[];
  status: 'pending' | 'active' | 'completed';
  dependencies: string[]; // Array of other phase IDs this phase depends on
  estimatedHours: number;
  // New fields for premium features
  aiSummary?: string;
  aiActions?: string[];
  aiQuote?: string;
}

export interface SubHabit {
  id: string;
  title: string;
}

// --- Atomic Habits System Types ---

/** Identity Statement - "I am a person who..." */
export interface HabitIdentity {
  id: string;
  statement: string;           // "אני אדם שמתאמן בקביעות"
  icon?: string;               // Emoji representing identity
  linkedHabitIds?: string[];   // Habits that reinforce this identity
  createdAt: string;
  reinforcements: number;      // Count of identity reinforcement moments
}

/** Habit Stacking Configuration */
export interface HabitStackConfig {
  anchorHabitId: string;       // The existing habit to attach to
  stackPosition: 'before' | 'after';
  formula?: string;            // "אחרי שאתאמן, אתמתח 5 דקות"
}

/** Temptation Bundling - Pair want with need */
export interface TemptationBundle {
  wantActivity: string;        // "לשמוע פודקאסט"
  formula?: string;            // "רק בזמן שאני הולך, אשמע פודקאסט"
}

/** Environment Design Cue */
export interface EnvironmentCue {
  id: string;
  type: 'visual' | 'location' | 'time' | 'preceding_event' | 'tool' | 'digital';
  description: string;         // "מטרית יוגה ליד המיטה"
  location?: string;           // Where to place the cue
  isActive: boolean;
}

/** Habit Trigger for bad habits */
export interface HabitTrigger {
  id: string;
  category: 'emotional' | 'situational' | 'social' | 'time' | 'preceding';
  description: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  occurrenceCount: number;
}

/** Bad Habit Breaking Strategy */
export interface BreakingStrategy {
  triggers: HabitTrigger[];           // What causes the urge
  substitutionAction: string;         // "במקום זה, אעשה..."
  frictionMethods: string[];          // Ways to make it harder
  commitmentDevice?: string;          // "אשלם ₪50 אם אכשל"
  supportPerson?: string;             // Accountability partner
}

/** Two-Minute Rule Starter Version */
export interface TwoMinuteStarter {
  microVersion: string;        // "לפתוח את הספר"
  fullVersion: string;         // "לקרוא 30 דקות"
  currentPhase: 'micro' | 'growing' | 'full';
  phaseCompletions: number;    // Times completed at current phase
  graduationThreshold: number; // Completions needed to advance (default: 7)
}

// --- Anti-Goal Tracker Types ---

/** Trigger - מה גורם לך ליפול */
export interface AntiGoalTrigger {
  id: string;
  description: string;
  category: 'emotional' | 'situational' | 'social' | 'physical' | 'other';
  intensity: 1 | 2 | 3 | 4 | 5;
  lastTriggered?: string;
  count: number;
}

/** Alternative Action - מה לעשות במקום */
export interface AlternativeAction {
  id: string;
  action: string;
  duration?: number; // minutes
  effectiveness: number; // 0-100
  usageCount: number;
}

/** Slip/Relapse Event - אירוע מעידה */
export interface SlipEvent {
  id: string;
  date: string;
  triggerId?: string;
  notes?: string;
  severity: 'minor' | 'major';
  recoveryTime?: number; // minutes
}

/** Anti-Goal Data - all anti-goal specific data */
export interface AntiGoalData {
  triggers: AntiGoalTrigger[];
  alternativeActions: AlternativeAction[];
  slipHistory: SlipEvent[];
  longestStreak: number;
  totalAvoidedDays: number;
  dailyCheckIn: boolean;
  lastCheckIn?: string; // ISO date
  motivation?: string;
  reward?: string;
}

export interface PersonalItem {
  id: string;
  type: PersonalItemType;
  createdAt: string;
  title?: string;
  content?: string; // Used for notes, link summaries, journal entries, book summaries
  projectId?: string; // ID of the parent goal/project
  updatedAt: string; // ISO timestamp
  tags?: string[];
  spaceId?: string; // New: For categorization into Spaces
  attachments?: Attachment[];
  icon?: string; // Icon identifier for the item
  order?: number; // For user-defined ordering

  // Encryption (Secure Notes)
  isEncrypted?: boolean; // True if content is encrypted
  encryptedContent?: {   // Encrypted version of 'content'
    iv: string;          // Base64-encoded initialization vector
    data: string;        // Base64-encoded encrypted content
    salt: string;        // Base64-encoded salt for key derivation
  };

  // Link specific
  url?: string;
  domain?: string;
  imageUrl?: string;

  // Workout specific
  exercises?: Exercise[];
  workoutStartTime?: string; // ISO timestamp
  workoutEndTime?: string; // ISO timestamp
  workoutDuration?: number; // Total workout duration in seconds
  workoutTemplateId?: string; // Template ID if loaded from template
  isActiveWorkout?: boolean; // True when workout is in progress

  // Task specific
  isCompleted?: boolean;
  isImportant?: boolean;
  isPinned?: boolean;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority?: 'low' | 'medium' | 'high';
  focusSessions?: FocusSession[];
  subTasks?: SubTask[];
  autoDeleteAfter?: number; // In days. 0 or undefined means never.
  isArchived?: boolean;

  // Google Tasks sync
  googleTaskId?: string;           // ID of the task in Google Tasks
  googleTaskListId?: string;       // ID of the task list in Google Tasks
  googleTasksSync?: boolean;       // Whether to sync this task with Google Tasks (default: true for tasks)

  // Habit specific
  habitType?: 'good' | 'bad'; // 'good' = build habit, 'bad' = quit habit
  streak?: number;
  lastCompleted?: string; // ISO date string (For 'bad' habits, this is the last Relapse date)
  completionHistory?: { date: string; duration?: number }[];
  completedDates?: string[]; // Array of ISO date strings (YYYY-MM-DD) for habit completion tracking
  frequency?: 'daily' | 'weekly' | 'custom';
  reminderEnabled?: boolean;
  reminderTime?: string; // "HH:mm" format
  subHabits?: SubHabit[];
  lastCompletedSubHabits?: Record<string, string>; // { [subHabitId]: ISO_DATE_STRING }

  // Atomic Habits System
  habitIdentityId?: string;              // Link to identity statement
  habitStack?: HabitStackConfig;         // Stacking configuration
  temptationBundle?: TemptationBundle;   // Bundling configuration
  environmentCues?: EnvironmentCue[];    // Visual/spatial cues
  breakingStrategy?: BreakingStrategy;   // For bad habits
  twoMinuteStarter?: TwoMinuteStarter;   // Gradual habit building
  frictionLevel?: 1 | 2 | 3 | 4 | 5;     // How hard to access (bad habits)
  habitScore?: number;                   // 0-100 habit strength
  bestStreak?: number;                   // All-time best streak
  totalCompletions?: number;             // Lifetime completions


  // Book specific
  author?: string;
  totalPages?: number;
  currentPage?: number;
  quotes?: string[];
  coverImageUrl?: string;

  // Roadmap specific
  phases?: RoadmapPhase[]; // Replaces 'steps' with the new hierarchical structure

  // For Kanban board view
  status?: 'todo' | 'doing' | 'done';

  // Learning specific
  flashcards?: { id: string; question: string; answer: string }[];

  // Anti-Goal specific
  antiGoalData?: AntiGoalData;

  // Metadata - Strongly typed union instead of 'any'
  metadata?:
  | WorkoutMetadata
  | LearningMetadata
  | JournalMetadata
  | GoalMetadata
  | LinkMetadata
  | BookMetadata;
}

// Specific metadata types (no 'any' allowed)

/**
 * Metadata for workout-related items
 */
export type WorkoutMetadata = {
  duration?: number; // in minutes
  feeling?: 'bad' | 'ok' | 'good' | 'great';
  calories?: number;
  notes?: string;
};

/**
 * Metadata for learning/educational items
 */
export type LearningMetadata = {
  status?: 'to-learn' | 'learning' | 'learned';
  source?: string; // URL, book title, course name, etc.
  key_takeaways?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
};

/**
 * Metadata for journal entries
 */
export type JournalMetadata = {
  mood?: 'awful' | 'bad' | 'ok' | 'good' | 'great';
  gratitude?: string[];
  highlights?: string[];
  lowlights?: string[];
};

/**
 * Metadata for goal tracking
 */
export type GoalMetadata = {
  targetDate?: string;
  milestones?: string[];
  progress?: number; // 0-100
  category?: string;
};

/**
 * Metadata for link/bookmark items (AI suggested)
 */
export type LinkMetadata = {
  suggestedTags?: string[];
  domain?: string;
  readingTime?: number; // in minutes
  isFavorite?: boolean;
};

/**
 * Metadata for book tracking
 */
export type BookMetadata = {
  bookStatus?: 'to-read' | 'reading' | 'finished';
  author?: string;
  pageCount?: number;
  currentPage?: number;
  rating?: number; // 1-5
};

export interface Template {
  id: string;
  name: string;
  type: PersonalItem['type'];
  // The content is a partial PersonalItem that holds the template data
  content: Partial<PersonalItem>;
}

// --- Comfort Zone Challenge ---
export interface ComfortZoneChallenge {
  id: string;
  date: string; // ISO Date (day)
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'hidden' | 'active' | 'completed' | 'failed';
  revealedAt?: string; // ISO Timestamp
}

// --- Comfort Zone Settings ---
export interface ComfortZoneSettings {
  useAiChallenges: boolean;        // מתג: AI או רשימה אישית
  customChallenges: string[];       // רשימת אתגרים אישיים
}


// --- New Types for Settings and Data Management ---

export type AddableType = PersonalItemType | 'spark' | 'ticker';
export type AppFont =
  | 'inter'
  | 'lato'
  | 'source-code-pro'
  | 'heebo'
  | 'rubik'
  | 'alef'
  | 'poppins'
  | 'marcelo'
  | 'satoshi'
  | 'clash-display';
export type CardStyle = 'glass' | 'flat' | 'bordered';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type HomeScreenComponentId =
  | 'gratitude'
  | 'habits'
  | 'tasks'
  | 'google_calendar'
  | 'comfort_zone'
  | 'quote'
  | 'quote_comfort_row'
  | 'focus_timer'
  | 'meditation';
export type UiDensity = 'compact' | 'comfortable' | 'spacious';
export type FeedViewMode = 'list' | 'visual';
export type AnimationIntensity = 'off' | 'subtle' | 'default' | 'full';
export type AiPersonality = 'concise' | 'encouraging' | 'formal' | 'coach' | 'mentor' | 'sparky' | 'default';
export type SwipeAction = 'complete' | 'delete' | 'postpone' | 'none';
export type BackgroundEffectType =
  | 'particles'
  | 'dark'
  | 'off'
  | 'oled'
  | 'ambient-mesh'
  | 'aurora-flow'
  | 'silk-waves'
  | 'particle-dust'
  | 'aurora'
  | 'studio';

export interface ThemeSettings {
  name: string;
  accentColor: string; // hex color - primary accent
  font: AppFont;
  cardStyle: CardStyle;
  backgroundEffect: BackgroundEffectType;
  borderRadius: BorderRadius;
  // Enhanced Customizations
  backgroundImage?: string; // Data URL
  fontWeight?: 'normal' | 'medium' | 'bold';

  // Premium Gradient Properties
  gradientStart?: string; // For buttons, headers, and accents
  gradientEnd?: string;
  glowColor?: string; // For glow effects around elements
  secondaryAccent?: string; // Secondary color for variety
}

export interface IntervalTimerSettings {
  restDuration: number; // in seconds
  workDuration: number; // in seconds
  autoStartNext: boolean;
}

export interface AiFeedSettings {
  isEnabled: boolean;
  topics: string[];
  itemsPerRefresh: number;
  customPrompt: string;
}

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreak: number; // minutes
  longBreak: number; // minutes
  sessionsUntilLongBreak: number;
  autoStartNext: boolean;
}

export type WorkoutGoal = 'strength' | 'hypertrophy' | 'endurance' | 'flexibility' | 'general';

export interface WorkoutSettings {
  defaultRestTime: number;
  defaultSets: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  keepAwake: boolean;
  oledMode: boolean;

  // Workout Goals & Preferences
  defaultWorkoutGoal: WorkoutGoal;
  enableWarmup: boolean;
  enableCooldown: boolean;
  warmupPreference: 'always' | 'never' | 'ask';
  cooldownPreference: 'always' | 'never' | 'ask';

  // Reminders
  waterReminderEnabled: boolean;
  waterReminderInterval: number; // minutes
  workoutRemindersEnabled: boolean;
  workoutReminderTime: string; // "HH:mm"
  reminderDays: number[]; // 0-6 (Sunday-Saturday)

  // Theme & Tracking
  selectedTheme: string; // theme id
  trackBodyWeight: boolean;

  // === NEW SETTINGS ===

  // Display & UI
  showGhostValues: boolean; // Show previous workout values
  showVolumePreview: boolean; // Show volume preview on exercises
  showIntensityMeter: boolean; // Show real-time intensity meter
  compactMode: boolean; // Compact UI for smaller screens

  // Rest Timer
  autoStartRest: boolean; // Auto-start rest timer after set
  restTimerVibrate: boolean; // Vibrate when rest ends
  restTimerSound: boolean; // Play sound when rest ends

  // Voice & Audio
  voiceCountdownEnabled: boolean; // Voice countdown for rest timer
  voiceLanguage: 'he-IL' | 'en-US'; // Voice language
  voiceVolume: number; // 0-1
  countdownBeepEnabled: boolean; // Beep sounds for countdown

  // Performance
  showPerformanceStats: boolean; // Show live performance analytics
  showSetHistory: boolean; // Show previous sets in current workout
  autoIncrementWeight: boolean; // Auto-suggest weight increase
  weightIncrementAmount: number; // kg to increment

  // Accessibility
  reducedAnimations: boolean; // Reduce motion for accessibility
  largeText: boolean; // Larger text for readability
  highContrast: boolean; // High contrast mode

  // === ADVANCED SETTINGS ===

  // Progressive Overload & Smart Features
  enableProgressiveOverload: boolean; // Track and suggest progressive overload
  progressiveOverloadPercent: number; // Target increase % per week (default: 2.5)
  enableOneRepMaxTracking: boolean; // Calculate and track estimated 1RM
  showExerciseNotes: boolean; // Show notes from previous workouts

  // Smart Rest Timer
  smartRestEnabled: boolean; // Adjust rest based on exercise type and intensity
  shortRestTime: number; // Rest for isolation/light exercises
  mediumRestTime: number; // Rest for compound exercises
  longRestTime: number; // Rest for heavy compound lifts
  extendRestAfterFailure: boolean; // Auto-extend rest if set was difficult

  // Workout Flow
  autoAdvanceExercise: boolean; // Auto-advance to next exercise after all sets
  confirmExerciseComplete: boolean; // Ask for confirmation before advancing
  enableSupersets: boolean; // Allow superset grouping
  showRestBetweenExercises: boolean; // Show rest timer between exercises

  // Personal Records
  enablePRAlerts: boolean; // Alert when PR is broken
  prCelebrationIntensity: 'off' | 'subtle' | 'full'; // PR celebration animation level
  trackVolumeRecords: boolean; // Track volume PRs in addition to weight PRs

  // Data & Analytics
  enableWorkoutAnalytics: boolean; // Track detailed workout analytics
  showMuscleGroupBalance: boolean; // Show muscle group balance in stats
  enableExportToCSV: boolean; // Allow exporting workout data

  // Timer Display
  timerDisplayMode: 'countdown' | 'countup' | 'both'; // How to show rest timer
  showTimerInHeader: boolean; // Show mini timer in header during rest

  // Quick Actions
  enableQuickWeightButtons: boolean; // Show +/- buttons for quick weight adjustment
  quickWeightIncrement: number; // Weight increment for quick buttons
  enableQuickRepsButtons: boolean; // Show +/- buttons for reps

  // Gym Mode
  gymModeEnabled: boolean; // Full screen mode optimized for gym use
  gymModeAutoLock: boolean; // Prevent accidental touches

  // Body Weight Tracking
  promptWeightBeforeWorkout: boolean; // Ask for body weight before workout
  promptWeightAfterWorkout: boolean; // Ask for body weight after workout
}

export interface HomeScreenComponent {
  id: HomeScreenComponentId;
  isVisible: boolean;
}

export type SpinnerVariant = 'default' | 'dots' | 'pulse' | 'orbit' | 'gradient' | 'wave';
export type StatusMessageType = 'success' | 'error' | 'info' | 'warning';
export type StatusMessageStyle = 'default' | 'minimal' | 'premium';

export interface VisualSettings {
  showStreaks: boolean;           // Show streak counters (habits, gratitude)
  showProgressBars: boolean;
  enableCelebrations: boolean;
  statusMessageStyle?: StatusMessageStyle;
}

// 📅 Calendar & Time Settings (inspired by TickTick/Things 3)
export interface CalendarSettings {
  workingHoursEnabled: boolean;         // Highlight working hours
  workingHoursStart: string;            // "HH:mm"
  workingHoursEnd: string;              // "HH:mm"
}

// ✅ Task Behavior Settings (inspired by Todoist/Things 3)
export interface TaskSettings {
  defaultPriority: 'low' | 'medium' | 'high';
  defaultDueTime: string;               // "HH:mm" - default time for due dates
  autoScheduleOverdue: boolean;         // Move overdue tasks to today
  autoArchiveCompleted: boolean;        // Archive completed after X days
  autoArchiveDays: number;              // Days before auto-archive (7, 14, 30)
  sortCompletedToBottom: boolean;       // Move completed tasks to bottom
  showTaskAge: boolean;                 // Show how old task is
  enableNaturalLanguage: boolean;       // Parse dates from text ("tomorrow")
  defaultListView: 'list' | 'kanban' | 'calendar';
}

// 🧠 Smart Features Settings (inspired by Notion/Obsidian)
export interface SmartFeaturesSettings {
  autoTagSuggestions: boolean;          // Suggest tags based on content
  duplicateDetection: boolean;          // Warn about similar items
  smartReschedule: boolean;             // Suggest better times for tasks
  aiWritingAssist: boolean;             // AI help while writing
  autoLinkDetection: boolean;           // Auto-detect links in text
  markdownEnabled: boolean;             // Enable markdown formatting
  autoBacklinks: boolean;               // Auto-create backlinks (Obsidian-style)
  smartReminders: boolean;              // AI suggested reminders
}

// ♿ Accessibility Settings
export interface AccessibilitySettings {
  reduceMotion: boolean;                // Minimize animations
}

// 🔒 Privacy Settings - REMOVED (not needed)

// 💾 Backup Settings
export interface BackupSettings {
  autoBackupEnabled: boolean;           // Enable automatic backups
  backupLocation: 'local' | 'google_drive' | 'both';
  backupRetentionDays: number;          // Keep backups for X days
  includeAttachments: boolean;          // Include files in backup
}

// 📰 Feed & Content Settings
export interface FeedSettings {
  markAsReadOnOpen: boolean;            // Mark item as read when opened
  feedRefreshInterval: 5 | 15 | 30 | 60; // Auto-refresh interval in minutes
  defaultFeedSort: 'newest' | 'oldest' | 'important';
  autoSummarizeAI: boolean;             // Auto-summarize with AI
}

// 🔁 Habits Settings
export interface HabitsSettings {
  weeklyGoalDays: number;               // Target days per week (1-7)
  showHabitStats: boolean;              // Show statistics
  showMissedHabits: boolean;            // Highlight missed habits
}

// 🏠 Home Screen Settings
export interface HomeSettings {
  showGreeting: boolean;                // Show personalized greeting
  widgetSize: 'small' | 'medium' | 'large';
  showCalendarPreview: boolean;         // Show upcoming events
  showWeatherWidget: boolean;           // Weather in header
  quickActionsEnabled: boolean;         // Show quick action buttons
}

// ⏱️ Focus Goals Settings
export interface FocusGoalSettings {
  dailyGoalMinutes: number;             // Daily focus goal (30-480)
  autoStartNextSession: boolean;        // Auto-start after break
  showFocusStats: boolean;              // Show statistics widget
  longBreakInterval: number;            // Sessions before long break (2-6)
  longBreakDuration: number;            // Long break duration (15-60)
}

export interface AppSettings {
  userName?: string;
  userEmoji?: string;
  aiModel: string; // Gemini model name (e.g., 'gemini-2.0-flash', 'gemini-2.5-pro')
  autoSummarize: boolean;
  themeSettings: ThemeSettings;
  lastAddedType?: AddableType;
  screenLabels: Partial<Record<Screen, string>>;
  sectionLabels: Record<string, string>; // Labels for home screen sections
  uiDensity: UiDensity;

  // New granular settings
  homeScreenLayout: HomeScreenComponent[];

  enabledMentorIds: string[];
  // Personalization
  hapticFeedback: boolean;
  soundEnabled: boolean;

  animationIntensity: AnimationIntensity;
  fontSizeScale: number;
  addScreenLayout: AddableType[];
  aiPersonality: AiPersonality;
  pomodoroSettings: PomodoroSettings;
  aiFeedSettings: AiFeedSettings;
  workoutSettings: WorkoutSettings;

  // 🔔 Consolidated Notification Settings
  notificationsSettings: NotificationsSettings;

  // 🎨 Consolidated UI Settings
  uiSettings: UiSettings;

  // ⚙ Legacy Settings (Deprecated - kept for migration types, will be removed from runtime)
  notificationsEnabled?: boolean;
  taskRemindersEnabled?: boolean;
  taskReminderTime?: number;
  enableHabitReminders?: boolean;
  dailyDigestEnabled?: boolean;
  dailyDigestTime?: string;
  weeklyReviewEnabled?: boolean;
  weeklyReviewDay?: number;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  celebrateCompletions?: boolean;
  quickAddEnabled?: boolean;
  defaultQuickAddType?: string;
  showConfirmDialogs?: boolean;
  hideQuickTemplates?: boolean;

  // Swipe Settings
  swipeRightAction: SwipeAction;
  swipeLeftAction: SwipeAction;

  // Cloud Sync
  lastSyncTime?: string; // ISO date string
  googleDriveBackupId?: string;
  autoSyncEnabled?: boolean; // Default true - auto-sync settings to cloud
  syncFrequency?: 15 | 30 | 60; // Sync interval in minutes

  // Visual Settings for enhanced components
  visualSettings: VisualSettings;

  // 📅 Calendar & Time Settings
  calendarSettings: CalendarSettings;
  intervalTimerSettings: IntervalTimerSettings;

  // ✅ Task Behavior Settings
  taskSettings: TaskSettings;

  // 🧠 Smart Features
  smartFeaturesSettings: SmartFeaturesSettings;

  // ♿ Accessibility Settings
  accessibilitySettings: AccessibilitySettings;

  // 🔒 Privacy Settings - REMOVED

  // 💾 Backup Settings
  backupSettings: BackupSettings;

  // 📰 Feed Settings
  feedSettings: FeedSettings;

  // 🔁 Habits Settings
  habitsSettings: HabitsSettings;

  // 🏠 Home Screen Settings
  homeSettings: HomeSettings;

  // ⏱️ Focus Goals
  focusGoalSettings: FocusGoalSettings;

  // 🎯 Comfort Zone Settings
  comfortZoneSettings: ComfortZoneSettings;

  // 📚 Library Settings
  libraryTabOrder?: string[]; // Custom order of library tab IDs
}

// 🔔 Consolidated Notification Interface
export interface NotificationsSettings {
  // Master Toggle
  enabled: boolean;

  // Tasks
  taskRemindersEnabled: boolean;
  taskReminderMinutes: 5 | 15 | 30 | 60;

  // Habits
  habitRemindersEnabled: boolean;
  habitReminderTime: string; // "HH:mm"

  // Calendar
  calendarRemindersEnabled: boolean;
  calendarReminderMinutes: number; // default: 15

  // Notes
  noteRemindersEnabled: boolean;

  // Digests
  dailyDigestEnabled: boolean;
  dailyDigestTime: string; // "HH:mm"
  weeklyReviewEnabled: boolean;
  weeklyReviewDay: number; // 0-6

  // Quiet Hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "HH:mm"
  quietHoursEnd: string; // "HH:mm"

  // Celebrations
  celebrateCompletions: boolean;
}

// 🎨 Consolidated UI Interface
export interface UiSettings {
  quickAddEnabled: boolean;
  defaultQuickAddType: PersonalItemType;
  showConfirmDialogs: boolean;
  hideQuickTemplates: boolean;
}



export interface WatchlistItem {
  id: string; // e.g., 'bitcoin' for crypto, 'TSLA' for stock
  name: string; // e.g., 'Bitcoin', 'Tesla Inc.'
  ticker: string; // e.g., 'BTC', 'TSLA'
  type: 'crypto' | 'stock';
}

export interface FinancialAsset extends WatchlistItem {
  price?: number;
  change24h?: number;
  marketCap?: number;
  sparkline?: number[]; // for 7d chart
  dailyChart?: { time: number; price: number }[];
}

export interface AppData {
  tags: Tag[];
  rssFeeds: RssFeed[];
  feedItems: FeedItem[];
  personalItems: PersonalItem[];
  templates: Template[];
  watchlist: WatchlistItem[];
  spaces: Space[];
  customMentors: Mentor[];
  customQuotes: Quote[];
  // New Workout Data
  bodyWeight: BodyWeightEntry[];
  workoutSessions: WorkoutSession[];
  workoutTemplates: WorkoutTemplate[];
}

export interface ExportData {
  settings: AppSettings;
  data: AppData;
  exportDate: string;
  version: number;
}

// --- New Mentor Types ---
export interface Mentor {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean; // To identify user-added mentors
  quotes: string[]; // The AI-generated or default content
}

// --- Quote System Types ---
export type QuoteCategory =
  | 'motivation'
  | 'stoicism'
  | 'tech'
  | 'success'
  | 'action'
  | 'dreams'
  | 'perseverance'
  | 'beginning'
  | 'sacrifice'
  | 'productivity'
  | 'possibility'
  | 'opportunity'
  | 'belief'
  | 'change'
  | 'passion'
  | 'custom'
  | 'wisdom'
  | 'life'
  | 'education'
  | 'happiness'
  | 'peace'
  | 'temptation'
  | 'reputation'
  | 'generosity'
  | 'power'
  | 'time'
  | 'love'
  | 'responsibility'
  | 'hope'
  | 'faith'
  | 'humility'
  | 'parenting'
  | 'spirituality'
  | 'integrity'
  | 'minimalism'
  | 'empathy'
  | 'unity'
  | 'justice'
  | 'philosophy'
  | 'respect'
  | 'nature'
  | 'humor'
  | 'evolution'
  | 'truth'
  | 'gratitude'
  | 'perception'
  | 'courage'
  | 'virtue'
  | 'creativity'
  | 'habits'
  | 'leadership'
  | 'history'
  | 'society'
  | 'quality'
  | 'design'
  | 'mindset'
  | 'patience'
  | 'value'
  | 'journey'
  | 'resilience'
  | 'purpose'
  | 'art'
  | 'growth'
  | 'optimism'
  | 'equality'
  | 'friendship'
  | 'legacy'
  | 'travel'
  | 'identity'
  | 'wellness'
  | 'strategy'
  | 'defense'
  | 'emotion'
  | 'strength'
  | 'money'
  | 'greed'
  | 'work'
  | 'moderation'
  | 'contrast'
  | 'pain'
  | 'constancy'
  | 'oblivion'
  | 'foresight'
  | 'fate'
  | 'humanity'
  | 'simplicity'
  | 'joy'
  | 'fortune'
  | 'persuasion'
  | 'direction'
  | 'karma'
  | 'diligence'
  | 'communication'
  | 'silence'
  | 'vitality'
  | 'law'
  | 'clarity'
  | 'discipline'
  | 'purity'
  | 'prayer'
  | 'restoration'
  | 'support'
  | 'protection'
  | 'blessing'
  | 'grace'
  | 'sovereignty'
  | 'holiness'
  | 'opening'
  | 'majesty'
  | 'worship'
  | 'trust'
  | 'surrender'
  | 'forgiveness'
  | 'innocence'
  | 'confession'
  | 'consequence'
  | 'job'
  | 'creation'
  | 'authority'
  | 'eternity'
  | 'watchfulness'
  | 'experience'
  | 'speech'
  | 'goodness'
  | 'care'
  | 'comfort'
  | 'adversity'
  | 'preservation';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
  backgroundImage?: string; // Optional URL or data URL
  isCustom?: boolean;
}

// --- Google Calendar Integration Types ---
export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  htmlLink?: string;
  location?: string;
  // Enhanced fields for Spark integration
  sparkTaskId?: string; // Link to a task in Spark
  isBlockedTime?: boolean; // Whether this is a time block for a task
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: string; minutes: number }>;
  };
}

// --- New Types for Password Manager ---
export interface EncryptedField {
  iv: string;
  data: string; // encrypted string
}
export interface PasswordItem {
  id: string;
  site: string;
  username: string;
  password: string | EncryptedField;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isSensitive?: boolean;
}

export interface EncryptedVault {
  iv: string;
  data: string; // encrypted JSON of PasswordItem[] (where some passwords may be EncryptedField)
  salt: string; // base64 encoded
  iterations: number;
  lastBackup?: string; // ISO date string
}

export interface ProductivityForecast {
  score: number; // 0-100
  forecastText: string; // A short, insightful sentence
}

export interface NlpResult {
  type: 'task' | 'note' | 'habit' | 'idea';
  title: string;
  dueDate?: string; // YYYY-MM-DD
  priority?: 'low' | 'medium' | 'high';
  suggestedSpaceId?: string;
}





// --- Universal Search Types ---
export type UniversalSearchResultType = PersonalItemType | FeedItem['type'] | 'calendar';
export interface UniversalSearchResult {
  id: string;
  type: UniversalSearchResultType;
  title: string;
  content: string;
  date: string; // ISO string
  item: PersonalItem | FeedItem | GoogleCalendarEvent;
}
export type FilterDateRange = 'all' | 'today' | 'week' | 'month';
export interface SearchFilters {
  type: 'all' | UniversalSearchResultType;
  dateRange: FilterDateRange;
  status: 'all' | 'open' | 'completed' | 'important';
}

// --- Sync Types ---
export interface SyncState {
  status: 'idle' | 'syncing' | 'conflict' | 'error';
  lastSyncTime?: string;
  lastError?: string;
  conflictCount: number;
}

export interface Conflict<T = unknown> {
  type: 'item' | 'setting';
  path: string;
  local: T;
  remote: T;
  timestamp: string;
}

export interface Delta<T = unknown> {
  added: string[];
  modified: string[];
  deleted: string[];
  changes: Record<string, T>;
}

// --- Authentication Types ---

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface EventLog {
  id: string;
  eventType:
  | 'spark_created'
  | 'task_completed'
  | 'habit_completed'
  | 'journal_entry'
  | 'workout_completed'
  | 'focus_session';
  itemId: string;
  itemTitle: string;
  timestamp: string | Date;
  metadata?: Record<string, string | number | boolean>;
}

// ============== NOTEBOOK MODULE TYPES ==============

/** A Notebook is the top-level container for knowledge organization */
export interface Notebook {
  id: string;
  userId: string;
  title: string;
  icon: string;                    // Emoji or icon identifier
  color: string;                   // Accent color for theming
  coverImageUrl?: string;          // Optional cover image (Firebase Storage URL)
  sectionIds: string[];            // Ordered list of section IDs
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

/** A Section groups pages within a notebook */
export interface NotebookSection {
  id: string;
  notebookId: string;
  title: string;
  icon?: string;
  pageIds: string[];               // Ordered list of page IDs
  isCollapsed: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

/** A Page is a document containing TipTap content */
export interface NotebookPage {
  id: string;
  sectionId: string;
  notebookId: string;              // Denormalized for query efficiency
  parentPageId?: string;           // null = root page, string = nested under parent
  title: string;
  icon?: string;
  coverImageUrl?: string;
  content: TipTapDocument;         // TipTap JSON format
  childPageIds: string[];          // Nested sub-pages
  isFavorite: boolean;
  templateId?: string;             // If created from a template
  lastEditedAt: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  wordCount?: number;
  tags?: string[];
  plainTextPreview?: string;         // Cached first 100 chars of plain text for fast list rendering
}

/** TipTap stores content as ProseMirror JSON */
export interface TipTapDocument {
  type: 'doc';
  content: TipTapNode[];
}

export interface TipTapNode {
  type: string;                    // 'paragraph', 'heading', 'taskItem', etc.
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

export interface TipTapMark {
  type: string;                    // 'bold', 'italic', 'link', etc.
  attrs?: Record<string, unknown>;
}

/** Page template for quick creation */
export interface PageTemplate {
  id: string;
  name: string;
  nameHe: string;                  // Hebrew name
  icon: string;
  content: TipTapDocument;
  isBuiltin: boolean;
  category: 'productivity' | 'planning' | 'journaling' | 'custom';
}

/** Block merge operation for conflict-free sync */
export interface BlockMergeOperation {
  type: 'insert' | 'update' | 'delete' | 'move';
  blockId: string;
  data?: Partial<TipTapNode>;
  targetPosition?: number;
  timestamp: number;
}
