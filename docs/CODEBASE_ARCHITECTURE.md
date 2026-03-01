# SparkOS - Codebase Architecture Documentation

> **מסמך זה מתאר את כל מבנה ה-codebase של SparkOS בצורה מפורטת.**  
> כל פעם שתבקש משימה, הבינה המלאכותית תוכל להשתמש במסמך זה כדי לדעת בדיוק איפה כל דבר נמצא.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Root Directory Structure](#root-directory-structure)
4. [Core Files](#core-files)
5. [Screens](#screens)
6. [Components](#components)
7. [Services](#services)
8. [Hooks](#hooks)
9. [Contexts](#contexts)
10. [Utils](#utils)
11. [Data & Configuration](#data--configuration)
12. [Types System](#types-system)
13. [Styling System](#styling-system)
14. [State Management](#state-management)
15. [File Quick Reference](#file-quick-reference)

---

## Project Overview

**SparkOS** הוא Personal Operating System - אפליקציית PWA מתקדמת לניהול חיים אישי הכוללת:

- 📝 **Tasks & Habits** - ניהול משימות והרגלים עם מערכת Atomic Habits
- 💪 **Workout Tracker** - מעקב אימונים מתקדם עם PR tracking
- 📰 **Smart Feed** - RSS feeds עם AI summarization
- 🎯 **Goals & Roadmaps** - תכנון יעדים ומפות דרכים
- 🧠 **AI Assistant** - עוזר AI מבוסס Gemini
- 💰 **Investments** - מעקב השקעות ותיקים
- 📅 **Calendar** - ניהול לוח שנה משולב
- 🔒 **Password Manager** - מנהל סיסמאות מאובטח
- ⏱️ **Focus Timer** - Pomodoro ו-Focus sessions

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2.0 |
| **Build Tool** | Vite 6.2.0 |
| **Styling** | TailwindCSS 3.4.17 |
| **State** | React Context + TanStack Query 5.x |
| **Animations** | Framer Motion 12.x |
| **Database** | IndexedDB (local) + Firebase Firestore (cloud) |
| **AI** | Google Gemini API (@google/genai) |
| **PWA** | vite-plugin-pwa |
| **Testing** | Vitest + Testing Library |
| **TypeScript** | 5.8.2 |

---

## Root Directory Structure

```
sparkos/
├── 📄 App.tsx                    # Root component
├── 📄 index.tsx                  # Entry point
├── 📄 index.html                 # HTML template
├── 📄 types.ts                   # Global TypeScript types (1013 lines)
├── 📄 constants.ts               # App constants & localStorage keys
├── 📄 global.d.ts                # Global type declarations
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tailwind.config.js         # TailwindCSS configuration
├── 📄 sw.js                      # Service Worker
├── 📄 manifest.json              # PWA manifest
│
├── 📁 components/                # UI Components (295 files)
├── 📁 screens/                   # Screen/Page components (15 files)
├── 📁 services/                  # Business logic & API calls (70 files)
├── 📁 hooks/                     # Custom React hooks (43 files)
├── 📁 src/                       # Additional source (contexts, styles)
├── 📁 utils/                     # Utility functions (11 files)
├── 📁 state/                     # State management (2 files)
├── 📁 config/                    # Configuration files
├── 📁 data/                      # Static data (quotes, etc.)
├── 📁 lib/                       # External library configs
├── 📁 tests/                     # Test files
├── 📁 docs/                      # Documentation
├── 📁 public/                    # Static assets
└── 📁 scripts/                   # Build/utility scripts
```

---

## Core Files

### Entry Points

| File | Purpose |
|------|---------|
| [index.tsx](file:///c:/Users/עילאי/Desktop/sparkos/index.tsx) | Application entry point, renders App with React.StrictMode |
| [App.tsx](file:///c:/Users/עילאי/Desktop/sparkos/App.tsx) | Root component with all providers hierarchy |
| [index.html](file:///c:/Users/עילאי/Desktop/sparkos/index.html) | HTML template with PWA meta tags |

### Provider Hierarchy (App.tsx)

```
QueryClientProvider (TanStack Query)
└── ErrorBoundary
    └── AppProviders (Data, Settings, Navigation, Focus, Calendar, Toast, UI, User)
        └── ModalProvider
            └── KeyboardShortcutsProvider
                ├── OfflineBanner
                ├── OnboardingTour
                ├── AppCore (Router)
                └── ModalRoot
```

### Configuration Files

| File | Purpose |
|------|---------|
| [vite.config.ts](file:///c:/Users/עילאי/Desktop/sparkos/vite.config.ts) | Vite build configuration, PWA settings, chunking strategy |
| [tailwind.config.js](file:///c:/Users/עילאי/Desktop/sparkos/tailwind.config.js) | TailwindCSS theme, colors, animations |
| [tsconfig.json](file:///c:/Users/עילאי/Desktop/sparkos/tsconfig.json) | TypeScript compiler options |
| [manifest.json](file:///c:/Users/עילאי/Desktop/sparkos/manifest.json) | PWA manifest (icons, theme, shortcuts) |
| [firebase.json](file:///c:/Users/עילאי/Desktop/sparkos/firebase.json) | Firebase hosting configuration |

---

## Screens

> **Location:** `screens/`

המסכים הראשיים של האפליקציה. כל מסך מייצג עמוד/נתיב נפרד.

| Screen File | Route | Description |
|-------------|-------|-------------|
| [FeedScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/FeedScreen.tsx) | `/feed` | RSS feeds, news, AI content, mentors |
| [HomeScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/HomeScreen.tsx) | `/today` | Dashboard with widgets, daily overview |
| [LibraryScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/LibraryScreen.tsx) | `/library` | Personal items: tasks, notes, habits, goals |
| [AddScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/AddScreen.tsx) | `/add` | Create new items with templates |
| [SearchScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/SearchScreen.tsx) | `/search` | Global search across all content |
| [SettingsScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/SettingsScreen.tsx) | `/settings` | App settings and preferences |
| [InvestmentsScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/InvestmentsScreen.tsx) | `/investments` | Portfolio tracking, watchlist |
| [AssistantScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/AssistantScreen.tsx) | `/assistant` | AI chat assistant |
| [CalendarScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/CalendarScreen.tsx) | `/calendar` | Calendar view |
| [PasswordManagerScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/PasswordManagerScreen.tsx) | `/passwords` | Password vault |
| [ViewsScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/ViewsScreen.tsx) | `/views` | Custom views configuration |
| [LoginScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/LoginScreen.tsx) | `/login` | User login |
| [SignupScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/SignupScreen.tsx) | `/signup` | User registration |
| [SpaceDetailScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/SpaceDetailScreen.tsx) | `/space/:id` | Space-specific content view |
| [ProjectDetailScreen.tsx](file:///c:/Users/עילאי/Desktop/sparkos/screens/ProjectDetailScreen.tsx) | `/project/:id` | Project detail view |

---

## Components

> **Location:** `components/`

### Directory Structure

```
components/
├── 📁 add/           # Add screen components (6 files)
├── 📁 animations/    # Animation components (4 files)
├── 📁 app/           # App-level components (5 files)
├── 📁 auth/          # Authentication UI (3 files)
├── 📁 boundaries/    # Error boundaries (6 files)
├── 📁 details/       # Item detail views (8 files)
├── 📁 feed/          # Feed components (3 files)
├── 📁 forms/         # Form components (4 files)
├── 📁 gestures/      # Touch gesture handlers (1 file)
├── 📁 habits/        # Atomic Habits system (11 files)
├── 📁 icons/         # Icon components (9 files)
├── 📁 investments/   # Investment components (2 files)
├── 📁 library/       # Library view components (19 files)
├── 📁 onboarding/    # Onboarding flow (1 file)
├── 📁 password/      # Password manager UI (8 files)
├── 📁 premium/       # Premium features (1 file)
├── 📁 settings/      # Settings UI (36 files)
├── 📁 spark/         # Spark-specific (2 files)
├── 📁 ui/            # Base UI components (11 files)
├── 📁 views/         # View configurations (2 files)
├── 📁 widgets/       # Dashboard widgets (12 files)
├── 📁 workout/       # Workout system (53 files)
└── 📄 [86 root-level component files]
```

### Key Component Files (Root Level)

| Component | Purpose |
|-----------|---------|
| [ItemCreationForm.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ItemCreationForm.tsx) | Main form for creating all item types (55KB - largest component) |
| [icons.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/icons.tsx) | All SVG icon components (56KB) |
| [BottomNavBar.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/BottomNavBar.tsx) | Main navigation bar |
| [SkeletonLoader.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/SkeletonLoader.tsx) | Loading skeleton components |
| [EmptyState.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/EmptyState.tsx) | Empty state illustrations |
| [ErrorBoundary.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ErrorBoundary.tsx) | React error boundary |
| [ModalRoot.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ModalRoot.tsx) | Modal rendering root |
| [CommandPalette.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/CommandPalette.tsx) | Cmd+K command palette |
| [ContextMenu.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ContextMenu.tsx) | Right-click context menus |
| [HabitItem.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/HabitItem.tsx) | Habit display/interaction |
| [TaskItem.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/TaskItem.tsx) | Task display/interaction |
| [FeedCard.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/FeedCard.tsx) | Feed item card |
| [CalendarView.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/CalendarView.tsx) | Calendar component |
| [VoiceInputModal.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/VoiceInputModal.tsx) | Voice-to-text input |
| [SmartCaptureModal.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/SmartCaptureModal.tsx) | Quick capture modal |

### Settings Components (`components/settings/`)

| Component | Purpose |
|-----------|---------|
| [settingsRegistry.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/settingsRegistry.tsx) | Settings definitions registry |
| [GeneralSection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/GeneralSection.tsx) | General settings |
| [AppearanceSection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/AppearanceSection.tsx) | Theme & appearance |
| [AISection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/AISection.tsx) | AI configuration |
| [WorkoutSection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/WorkoutSection.tsx) | Workout settings |
| [NotificationsSection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/NotificationsSection.tsx) | Notification preferences |
| [DataSection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/DataSection.tsx) | Data management |
| [IntegrationsSection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/IntegrationsSection.tsx) | Third-party integrations |
| [PrivacySection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/settings/PrivacySection.tsx) | Privacy & security |

### Workout Components (`components/workout/`)

| Component | Purpose |
|-----------|---------|
| [ActiveWorkoutNew.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/ActiveWorkoutNew.tsx) | Active workout session UI |
| [ExerciseSelector.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/ExerciseSelector.tsx) | Exercise selection modal |
| [WorkoutStartModal.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/WorkoutStartModal.tsx) | Workout start configuration |
| [WorkoutSummary.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/WorkoutSummary.tsx) | Post-workout summary |
| [WorkoutTemplates.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/WorkoutTemplates.tsx) | Template management |
| [WorkoutPlanner.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/WorkoutPlanner.tsx) | Workout planning |
| [AICoach.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/AICoach.tsx) | AI workout coach |
| [AnalyticsDashboard.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/AnalyticsDashboard.tsx) | Workout analytics |
| [RestTimer.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/RestTimer.tsx) | Rest period timer |
| [BodyWeightTracker.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/workout/BodyWeightTracker.tsx) | Weight tracking |

### Widget Components (`components/widgets/`)

| Widget | Purpose |
|--------|---------|
| [QuoteWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/QuoteWidget.tsx) | Daily quote display |
| [TasksTodayWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/TasksTodayWidget.tsx) | Today's tasks |
| [HabitsTrackerWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/HabitsTrackerWidget.tsx) | Habit tracking |
| [FocusTimerWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/FocusTimerWidget.tsx) | Focus/Pomodoro timer |
| [DailyStreakWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/DailyStreakWidget.tsx) | Streak counter |
| [PomodoroMiniWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/PomodoroMiniWidget.tsx) | Mini Pomodoro |
| [CalendarWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/CalendarWidget.tsx) | Calendar preview |
| [AntiGoalsWidget.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/widgets/AntiGoalsWidget.tsx) | Anti-goals tracking |

### UI Components (`components/ui/`)

| Component | Purpose |
|-----------|---------|
| [Button.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ui/Button.tsx) | Base button component |
| [Input.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ui/Input.tsx) | Base input component |
| [PremiumSelect.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ui/PremiumSelect.tsx) | Custom select dropdown |
| [Toast.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ui/Toast.tsx) | Toast notifications |
| [AndroidRipple.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ui/AndroidRipple.tsx) | Material ripple effect |
| [PullToRefresh.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/ui/PullToRefresh.tsx) | Pull-to-refresh gesture |

### Habits Components (`components/habits/`)

מערכת Atomic Habits מלאה:

| Component | Purpose |
|-----------|---------|
| [HabitIdentitySection.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/HabitIdentitySection.tsx) | "I am a person who..." identity |
| [HabitStackingEditor.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/HabitStackingEditor.tsx) | Habit stacking configuration |
| [TemptationBundleEditor.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/TemptationBundleEditor.tsx) | Temptation bundling |
| [EnvironmentDesigner.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/EnvironmentDesigner.tsx) | Environment cues |
| [TwoMinuteRuleWizard.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/TwoMinuteRuleWizard.tsx) | 2-minute rule implementation |
| [BadHabitBreaker.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/BadHabitBreaker.tsx) | Breaking bad habits |
| [TriggerTracker.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/TriggerTracker.tsx) | Habit trigger tracking |
| [FrictionDesigner.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/FrictionDesigner.tsx) | Friction for bad habits |
| [CommitmentDevice.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/CommitmentDevice.tsx) | Commitment devices |
| [SubstitutionSelector.tsx](file:///c:/Users/עילאי/Desktop/sparkos/components/habits/SubstitutionSelector.tsx) | Habit substitution |

---

## Services

> **Location:** `services/`

### Directory Structure

```
services/
├── 📁 ai/            # AI services (12 files)
├── 📁 db/            # IndexedDB operations (9 files)
├── 📁 data/          # Data layer services (9 files)
├── 📁 financials/    # Financial calculations (10 files)
└── 📄 [30 root-level service files]
```

### AI Services (`services/ai/`)

| Service | Purpose |
|---------|---------|
| [geminiClient.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/geminiClient.ts) | Gemini API client wrapper |
| [chatService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/chatService.ts) | AI chat functionality |
| [contentService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/contentService.ts) | Content generation |
| [feedService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/feedService.ts) | AI feed generation |
| [nlpService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/nlpService.ts) | Natural language processing |
| [searchService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/searchService.ts) | AI-powered search |
| [suggestionsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/suggestionsService.ts) | Smart suggestions |
| [roadmapService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/roadmapService.ts) | AI roadmap generation |
| [rateLimiter.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/rateLimiter.ts) | API rate limiting |
| [responseCache.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/responseCache.ts) | Response caching |
| [aiMetrics.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/ai/aiMetrics.ts) | AI usage metrics |

### Database Services (`services/db/`)

| Service | Purpose |
|---------|---------|
| [indexedDBCore.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/indexedDBCore.ts) | IndexedDB core operations |
| [personalItemsDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/personalItemsDb.ts) | Personal items CRUD |
| [feedItemsDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/feedItemsDb.ts) | Feed items storage |
| [feedsDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/feedsDb.ts) | RSS feeds storage |
| [spacesDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/spacesDb.ts) | Spaces storage |
| [workoutDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/workoutDb.ts) | Workout data (13KB - largest DB service) |
| [authTokensDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/authTokensDb.ts) | Auth tokens storage |
| [watchlistDb.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/db/watchlistDb.ts) | Investment watchlist |

### Data Services (`services/data/`)

| Service | Purpose |
|---------|---------|
| [dbCore.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/data/dbCore.ts) | Database core abstraction |
| [personalItemsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/data/personalItemsService.ts) | Personal items business logic |
| [feedItemsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/data/feedItemsService.ts) | Feed items business logic |
| [workoutService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/data/workoutService.ts) | Workout business logic |
| [spacesService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/data/spacesService.ts) | Spaces business logic |
| [quotesService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/data/quotesService.ts) | Quotes data service |

### Core Services (Root Level)

| Service | Purpose |
|---------|---------|
| [geminiService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/geminiService.ts) | Main Gemini AI service (62KB - largest file) |
| [financialsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/financialsService.ts) | Financial calculations (50KB) |
| [firestoreService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/firestoreService.ts) | Firebase Firestore operations |
| [authService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/authService.ts) | Authentication service |
| [settingsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/settingsService.ts) | Settings persistence |
| [dataService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/dataService.ts) | Data orchestration |
| [feedService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/feedService.ts) | Feed management |
| [rssService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/rssService.ts) | RSS feed fetching |
| [analyticsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/analyticsService.ts) | Usage analytics |
| [cloudSyncService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/cloudSyncService.ts) | Cloud synchronization |
| [cryptoService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/cryptoService.ts) | Encryption/decryption |
| [notificationsService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/notificationsService.ts) | Push notifications |
| [performanceService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/performanceService.ts) | Performance monitoring |
| [webhookService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/webhookService.ts) | Webhook integrations |
| [prService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/prService.ts) | Personal Record tracking |
| [importService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/importService.ts) | Data import |
| [mockData.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/mockData.ts) | Mock data for development (83KB) |

### Google Integration Services

| Service | Purpose |
|---------|---------|
| [googleAuthService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/googleAuthService.ts) | Google OAuth |
| [googleCalendarService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/googleCalendarService.ts) | Google Calendar API |
| [googleDriveService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/googleDriveService.ts) | Google Drive backup |
| [googleTasksService.ts](file:///c:/Users/עילאי/Desktop/sparkos/services/googleTasksService.ts) | Google Tasks sync |

---

## Hooks

> **Location:** `hooks/`

### Directory Structure

```
hooks/
├── 📁 add/              # Add screen hooks (1 file)
├── 📁 app/              # App-level hooks (1 file)
├── 📁 notifications/    # Notification hooks (6 files)
└── 📄 [35 root-level hook files]
```

### Core Hooks

| Hook | Purpose |
|------|---------|
| [useDebounce.tsx](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useDebounce.tsx) | Debounced values and callbacks |
| [useLocalStorage.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useLocalStorage.ts) | localStorage with React state |
| [useMediaQuery.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useMediaQuery.ts) | Responsive breakpoints |
| [useNetworkStatus.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useNetworkStatus.ts) | Online/offline detection |
| [useOnClickOutside.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useOnClickOutside.ts) | Click outside detection |
| [useToggle.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useToggle.ts) | Boolean toggle state |
| [usePrevious.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/usePrevious.ts) | Previous value tracking |
| [useClipboard.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useClipboard.ts) | Clipboard operations |

### Feature Hooks

| Hook | Purpose |
|------|---------|
| [useWorkoutTimer.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useWorkoutTimer.ts) | Workout timer logic (12KB) |
| [useSound.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useSound.ts) | Sound effects (12KB) |
| [useWakeLock.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useWakeLock.ts) | Screen wake lock |
| [useCelebration.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useCelebration.ts) | Confetti celebrations |
| [useContextMenu.tsx](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useContextMenu.tsx) | Context menu state |
| [useFeedData.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useFeedData.ts) | Feed data fetching |
| [useFitnessInsights.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useFitnessInsights.ts) | Fitness analytics |
| [useFocusTrap.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useFocusTrap.ts) | Modal focus trapping |
| [useHaptics.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useHaptics.ts) | Haptic feedback |
| [useIdleTimer.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useIdleTimer.ts) | Idle detection |
| [usePullToRefresh.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/usePullToRefresh.ts) | Pull-to-refresh gesture |
| [usePwaUpdate.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/usePwaUpdate.ts) | PWA update detection |
| [useReducedMotion.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useReducedMotion.ts) | Accessibility preference |
| [useSpeechRecognition.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useSpeechRecognition.ts) | Voice input |
| [useThemeEffect.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useThemeEffect.ts) | Theme application |
| [useGoogleCalendar.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useGoogleCalendar.ts) | Google Calendar integration |
| [useBeforeUnloadWarning.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useBeforeUnloadWarning.ts) | Unsaved changes warning |
| [useConfirmDialog.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useConfirmDialog.ts) | Confirmation dialogs |
| [useDoubleTapExit.ts](file:///c:/Users/עילאי/Desktop/sparkos/hooks/useDoubleTapExit.ts) | Mobile exit gesture |

---

## Contexts

> **Location:** `src/contexts/`

| Context | Purpose |
|---------|---------|
| [AppProviders.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/AppProviders.tsx) | All providers combined |
| [DataContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/DataContext.tsx) | Personal items, spaces, tags data |
| [SettingsContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/SettingsContext.tsx) | App settings state |
| [NavigationContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/NavigationContext.tsx) | Screen navigation state |
| [FocusContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/FocusContext.tsx) | Focus/Pomodoro timer (25KB) |
| [CalendarContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/CalendarContext.tsx) | Calendar events (21KB) |
| [ToastContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/ToastContext.tsx) | Toast notifications |
| [UIContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/UIContext.tsx) | UI state (sidebar, modals) |
| [UserContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/src/contexts/UserContext.tsx) | User authentication state |

### State Management (`state/`)

| File | Purpose |
|------|---------|
| [ModalContext.tsx](file:///c:/Users/עילאי/Desktop/sparkos/state/ModalContext.tsx) | Global modal state |
| [appReducer.ts](file:///c:/Users/עילאי/Desktop/sparkos/state/appReducer.ts) | App-wide reducer (legacy) |

---

## Utils

> **Location:** `utils/`

| Utility | Purpose |
|---------|---------|
| [dateUtils.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/dateUtils.ts) | Date formatting & manipulation |
| [timeUtils.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/timeUtils.ts) | Time calculations |
| [taskTimeUtils.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/taskTimeUtils.ts) | Task scheduling utilities |
| [array.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/array.ts) | Array helpers |
| [validation.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/validation.ts) | Input validation |
| [errorMessages.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/errorMessages.ts) | Error message constants |
| [logger.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/logger.ts) | Logging utility |
| [markdownParser.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/markdownParser.ts) | Markdown parsing |
| [performance.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/performance.ts) | Performance utilities |
| [rateLimiter.ts](file:///c:/Users/עילאי/Desktop/sparkos/utils/rateLimiter.ts) | Rate limiting |

---

## Data & Configuration

### Config (`config/`)

| File | Purpose |
|------|---------|
| [appConstants.ts](file:///c:/Users/עילאי/Desktop/sparkos/config/appConstants.ts) | App-wide constants |
| [firebase.ts](file:///c:/Users/עילאי/Desktop/sparkos/config/firebase.ts) | Firebase configuration |

### Static Data (`data/`)

| Directory/File | Purpose |
|----------------|---------|
| [quotesData.ts](file:///c:/Users/עילאי/Desktop/sparkos/data/quotesData.ts) | Built-in quotes collection |
| [quotes/](file:///c:/Users/עילאי/Desktop/sparkos/data/quotes/) | Quotes by category (16 files) |

### Lib (`lib/`)

| File | Purpose |
|------|---------|
| [queryClient.ts](file:///c:/Users/עילאי/Desktop/sparkos/lib/queryClient.ts) | TanStack Query client config |

---

## Types System

> **Location:** `types.ts` (1013 lines)

### Core Types

```typescript
// Screens
type Screen = 'feed' | 'search' | 'add' | 'today' | 'library' | 'settings' | 
              'investments' | 'assistant' | 'dashboard' | 'calendar' | 
              'passwords' | 'views' | 'login' | 'signup';

// Item Types
type PersonalItemType = 'task' | 'habit' | 'antigoal' | 'workout' | 'note' | 
                        'link' | 'learning' | 'goal' | 'journal' | 'book' | 
                        'idea' | 'gratitude' | 'roadmap';
```

### Key Interfaces

| Interface | Purpose | Lines |
|-----------|---------|-------|
| `PersonalItem` | Main item type for all personal content | ~90 fields |
| `AppSettings` | All app settings | ~80 fields |
| `WorkoutSession` | Workout session data | 15 fields |
| `FeedItem` | RSS/News feed item | 18 fields |
| `Space` | Content organization space | 8 fields |
| `RoadmapPhase` | Roadmap phase with tasks | 15 fields |

### Settings Interfaces

- `ThemeSettings` - Theme customization
- `WorkoutSettings` - Workout preferences
- `PomodoroSettings` - Focus timer settings
- `TaskSettings` - Task behavior
- `HabitsSettings` - Habit tracking
- `FeedSettings` - Feed preferences
- `CalendarSettings` - Calendar options
- `PrivacySettings` - Privacy/security
- `BackupSettings` - Backup configuration
- `AccessibilitySettings` - A11y preferences

### Atomic Habits Types

- `HabitIdentity` - Identity statements
- `HabitStackConfig` - Habit stacking
- `TemptationBundle` - Temptation bundling
- `EnvironmentCue` - Environmental cues
- `HabitTrigger` - Trigger tracking
- `BreakingStrategy` - Bad habit breaking
- `TwoMinuteStarter` - 2-minute rule

### Anti-Goal Types

- `AntiGoalTrigger` - Trigger tracking
- `AlternativeAction` - Substitution actions
- `SlipEvent` - Relapse events
- `AntiGoalData` - Complete anti-goal data

---

## Styling System

### CSS Files

| File | Purpose |
|------|---------|
| [src/index.css](file:///c:/Users/עילאי/Desktop/sparkos/src/index.css) | Global styles (15KB) |
| [src/design-tokens.css](file:///c:/Users/עילאי/Desktop/sparkos/src/design-tokens.css) | CSS variables & tokens (62KB) |
| [src/fonts.css](file:///c:/Users/עילאי/Desktop/sparkos/src/fonts.css) | Font definitions |
| [src/animation-density.css](file:///c:/Users/עילאי/Desktop/sparkos/src/animation-density.css) | Animation settings |
| [styles/](file:///c:/Users/עילאי/Desktop/sparkos/styles/) | Additional stylesheets |

### TailwindCSS Configuration

- Theme extended in `tailwind.config.js`
- Custom colors, spacing, animations
- Typography, shadows, gradients

---

## State Management

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React Query                         │
│  (Server state, caching, background updates)        │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│               React Context Providers               │
├──────────┬──────────┬──────────┬──────────┬────────┤
│ Data     │ Settings │ Focus    │ Calendar │ UI     │
│ Context  │ Context  │ Context  │ Context  │ Context│
└──────────┴──────────┴──────────┴──────────┴────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│                   IndexedDB                          │
│  (Persistent local storage via services/db/)        │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────┐
│             Firebase Firestore (Cloud)              │
│  (Cloud sync via firestoreService.ts)               │
└─────────────────────────────────────────────────────┘
```

### Data Flow

1. **UI Component** triggers action
2. **Context** dispatches update
3. **Service** persists to IndexedDB
4. **Cloud Sync** uploads to Firestore (if enabled)
5. **React Query** invalidates cache
6. **UI** re-renders with new data

---

## File Quick Reference

### By Feature

| Feature | Key Files |
|---------|-----------|
| **Tasks** | `TaskItem.tsx`, `TasksSection.tsx`, `taskSettings` in types |
| **Habits** | `HabitItem.tsx`, `components/habits/*`, `HabitsSettings` |
| **Workout** | `components/workout/*`, `workoutDb.ts`, `WorkoutSession` |
| **Feed** | `FeedScreen.tsx`, `FeedCard.tsx`, `feedService.ts`, `rssService.ts` |
| **AI** | `services/ai/*`, `geminiService.ts`, `AssistantScreen.tsx` |
| **Settings** | `components/settings/*`, `settingsService.ts`, `AppSettings` |
| **Calendar** | `CalendarContext.tsx`, `CalendarView.tsx`, `googleCalendarService.ts` |
| **Investments** | `InvestmentsScreen.tsx`, `financialsService.ts` |
| **Passwords** | `components/password/*`, `PasswordManagerScreen.tsx`, `cryptoService.ts` |

### By Size (Largest Files)

| File | Size | Purpose |
|------|------|---------|
| `mockData.ts` | 83KB | Development mock data |
| `geminiService.ts` | 62KB | AI service |
| `design-tokens.css` | 62KB | CSS variables |
| `icons.tsx` | 56KB | Icon components |
| `ItemCreationForm.tsx` | 55KB | Item creation |
| `financialsService.ts` | 50KB | Financial service |
| `LibraryScreen.tsx` | 51KB | Library screen |
| `ItemCreationFormFields.tsx` | 31KB | Form fields |
| `types.ts` | 28KB | Type definitions |

---

## Development Commands

```bash
# Development
npm run dev        # Start dev server (Vite HMR)

# Build
npm run build      # Production build
npm run preview    # Preview production build

# Testing
npm run test       # Run Vitest tests
npm run test:coverage  # With coverage

# Code Quality
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier

# Deployment
npm run deploy     # Build + Firebase deploy
```

---

## Quick Navigation Tips

### For AI Assistant

כשמבקשים ממך לעשות שינוי:

1. **משימות/Tasks** → חפש ב-`TaskItem.tsx`, `PersonalItem` type
2. **הרגלים/Habits** → חפש ב-`components/habits/`, `HabitItem.tsx`
3. **אימונים/Workout** → חפש ב-`components/workout/`, `services/db/workoutDb.ts`
4. **הגדרות/Settings** → חפש ב-`components/settings/`, `settingsService.ts`
5. **AI Features** → חפש ב-`services/ai/`, `geminiService.ts`
6. **UI Components** → חפש ב-`components/ui/`
7. **Styling** → חפש ב-`src/design-tokens.css`, `tailwind.config.js`
8. **Types** → הכל ב-`types.ts`
9. **Constants** → הכל ב-`constants.ts`

---

---

## Deep Analysis - Function Level Documentation

### GeminiService.ts (1828 lines, 66 functions)

**מבנה הקובץ:**
```
┌─────────────────────────────────────────────────────────────┐
│ RateLimiter Class                                           │
│ - throttle(fn) - Rate limiting with queue                   │
│ - executeWithDelay(fn) - Delay between API calls           │
│ - processQueue() - Queue processing                         │
├─────────────────────────────────────────────────────────────┤
│ ResponseCache Class (LRU Cache)                             │
│ - hash(key) - Generate cache key                            │
│ - get(key) - Retrieve from cache with TTL check             │
│ - set(key, value) - Store with size limit                   │
│ - clear() - Clear entire cache                              │
├─────────────────────────────────────────────────────────────┤
│ AI Functions                                                │
│ - summarizeText() - Summarize articles                      │
│ - generateMentorContent() - Generate mentor quotes          │
│ - generateRoadmapPhases() - Create roadmap from goal        │
│ - generateFlashcards() - Create flashcards from text        │
│ - parseNaturalLanguage() - NLP for task creation            │
│ - searchWithAI() - AI-powered search                        │
│ - generateAIFeedItems() - AI content generation             │
│ - getChatResponse() - Conversational AI                     │
│ - getProductivityForecast() - Daily productivity score      │
└─────────────────────────────────────────────────────────────┘
```

**Key AI Functions:**

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| `summarizeText` | `text: string, language: string` | `Promise<string>` | AI text summarization |
| `generateRoadmapPhases` | `goal: string, context?: string` | `Promise<RoadmapPhase[]>` | Generate project phases |
| `parseNaturalLanguage` | `input: string` | `Promise<NlpResult>` | Parse "תזכיר לי מחר..." |
| `searchWithAI` | `query: string, items: PersonalItem[]` | `Promise<AiSearchResult>` | Semantic search |
| `getChatResponse` | `messages: Message[], personality: AiPersonality` | `Promise<string>` | Chat assistant |

---

### DataService.ts (462 lines, 24 functions)

**Architecture - Facade Pattern:**

```
┌─────────────────────────────────────────────────────────────┐
│                      dataService.ts                         │
│                    (FACADE LAYER)                           │
├─────────────────────────────────────────────────────────────┤
│  Re-exports from:                                           │
│  - indexedDBCore.ts (Core DB operations)                    │
│  - personalItemsDb.ts (Personal items CRUD)                 │
│  - workoutDb.ts (Workout data)                              │
│  - spacesDb.ts (Spaces management)                          │
│  - feedsDb.ts (RSS feeds)                                   │
│  - watchlistDb.ts (Investment watchlist)                    │
│  - authTokensDb.ts (OAuth tokens)                           │
├─────────────────────────────────────────────────────────────┤
│  Local Functions:                                           │
│  - exportAllData(password?) - JSON export with encryption   │
│  - importAllData(json, password?) - Import with decryption  │
│  - wipeAllData() - Factory reset                            │
│  - rollOverIncompleteTasks() - Move overdue to today        │
│  - cleanupCompletedTasks() - Auto-archive old tasks         │
└─────────────────────────────────────────────────────────────┘
```

---

### FinancialsService.ts (1681 lines, 93 functions)

**API Key Rotation System:**

```typescript
// Multi-key rotation with rate limiting
const RATE_LIMIT_PER_KEY = {
  requestsPerMinute: 5,
  requestsPerDay: 25,
  minDelayMs: 12000
};

// Functions:
getAvailableApiKey()     // Get next available key
recordApiKeyUsage(key)   // Track usage
markKeyAsExhausted(key)  // Mark rate-limited key
getRemainingRequests()   // Check remaining quota
addApiKey(newKey)        // Add new API key
```

**Data Sources:**

| Source | Function | Data Type |
|--------|----------|-----------|
| FreeCryptoAPI | `fetchCryptoData()` | Crypto prices |
| Alpha Vantage | `fetchStockData()` | Stock quotes |
| Alpha Vantage | `fetchCompanyOverview()` | Company info |
| Multiple | `fetchChartData()` | Historical prices |
| Multiple | `fetchTopMovers()` | Market movers |

---

### FirestoreService.ts (847 lines, 60 functions)

**Real-time Sync Architecture:**

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Local State    │───▶│  Firestore Sync  │───▶│  Cloud Firestore │
│   (IndexedDB)    │◀───│   Operations     │◀───│   Collections    │
└──────────────────┘    └──────────────────┘    └──────────────────┘

Collections:
├── users/{userId}/
│   ├── personalItems/
│   ├── settings
│   ├── bodyWeight/
│   ├── workoutSessions/
│   ├── workoutTemplates/
│   ├── spaces/
│   ├── tags/
│   ├── quotes/
│   ├── feedItems/
│   ├── templates/
│   └── watchlist/
```

**Subscription Functions:**

| Function | Real-time | Purpose |
|----------|-----------|---------|
| `subscribeToPersonalItems()` | ✅ | Listen for item changes |
| `subscribeToSettings()` | ✅ | Sync settings across devices |
| `subscribeToBodyWeight()` | ✅ | Weight tracking sync |
| `subscribeToWorkoutSessions()` | ✅ | Workout history sync |
| `subscribeToWorkoutTemplates()` | ✅ | Template sync |

---

### FocusContext.tsx (833 lines, 27 functions)

**Pomodoro Timer State Machine:**

```
┌─────────┐    start     ┌─────────┐    complete   ┌─────────────┐
│  idle   │─────────────▶│  focus  │──────────────▶│ short_break │
└─────────┘              └─────────┘               └─────────────┘
     ▲                        │                          │
     │                   pause│                          │
     │                        ▼                          │
     │                   ┌─────────┐                     │
     │                   │ paused  │                     │
     │                   └─────────┘                     │
     │                                                   │
     │              after 4 sessions                     │
     │     ┌────────────────────────────────────────────┘
     │     ▼
     │ ┌─────────────┐
     └─│ long_break  │
       └─────────────┘
```

**Exported Hooks:**

| Hook | Purpose |
|------|---------|
| `useFocusSession()` | Full context access |
| `useFocusTimer()` | Timer display only |
| `useFocusStats()` | Statistics only |
| `useFocusControls()` | Start/pause/cancel |
| `useIsInFocusSession()` | Boolean check |
| `useFocusHistory()` | Session history |

---

### ItemCreationForm.tsx (1357 lines, 17 functions)

**Form State Management - Reducer Pattern:**

```typescript
// Separate reducer file: itemCreationFormReducer.ts

type FormAction = 
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AI_SUGGESTIONS'; payload: string[] }
  | { type: 'RESET_FORM' }
  // ... more actions

interface FormState {
  title: string;
  content: string;
  isLoading: boolean;
  aiSuggestions: string[];
  // ... more fields
}
```

**Supported Item Types:**

| Type | Form Fields | AI Features |
|------|-------------|-------------|
| `task` | title, dueDate, dueTime, priority | Smart scheduling |
| `habit` | title, frequency, reminderTime | Identity suggestions |
| `note` | title, content (markdown) | Auto-tags |
| `link` | url → auto-fetch metadata | Summarization |
| `book` | title, author, totalPages | Reading goals |
| `roadmap` | title, goal description | Phase generation |
| `workout` | template selection | Exercise suggestions |
| `journal` | content, mood, gratitude | Prompts |

---

### LibraryScreen.tsx (1232 lines, 10 functions)

**Hub View Architecture:**

```typescript
type HubView = 
  | 'main'        // Spaces grid
  | 'files'       // File gallery
  | 'passwords'   // Password manager
  | 'fitness'     // Fitness hub
  | 'investments' // Investment tracker;

type ActiveView = 
  | { type: HubView }
  | { type: 'project'; item: PersonalItem }  // Goal/Roadmap detail
  | { type: 'space'; item: Space }            // Space items
  | { type: 'inbox' };                         // Uncategorized items
```

**Lazy Loaded Views:**

```typescript
const NotebookView = lazy(() => import('...'));
const CalendarView = lazy(() => import('...'));
const TimelineView = lazy(() => import('...'));
const PasswordManager = lazy(() => import('...'));
const InvestmentsScreen = lazy(() => import('...'));
```

---

## Complete Data Flow Architecture

### Create New Item Flow

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ AddScreen   │────▶│ ItemCreationForm│────▶│ DataContext     │
│ (UI)        │     │ (Validation)    │     │ (State)         │
└─────────────┘     └─────────────────┘     └────────┬────────┘
                                                      │
                    ┌─────────────────────────────────┴─────────────┐
                    │                                               │
              ┌─────▼─────┐                                 ┌───────▼───────┐
              │ IndexedDB │◀────────────────────────────────│ dataService.ts│
              │ (Local)   │                                 │ (Facade)      │
              └─────┬─────┘                                 └───────────────┘
                    │
              ┌─────▼─────┐     ┌──────────────────┐
              │ syncService│────▶│ firestoreService │
              │ (Sync)     │     │ (Cloud)          │
              └────────────┘     └──────────────────┘
```

### Settings Update Flow

```
┌────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Settings UI    │────▶│ SettingsContext │────▶│ settingsService │
│ (Sections)     │     │ (React State)   │     │ (localStorage)  │
└────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌───────────────────────────┘
                              │
                       ┌──────▼──────┐     ┌──────────────────┐
                       │ Cloud Sync  │────▶│ firestoreService │
                       │ (if enabled)│     │ syncSettings()   │
                       └─────────────┘     └──────────────────┘
```

### AI Request Flow

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Component   │────▶│ geminiService   │────▶│ RateLimiter     │
│ (UI)        │     │ (Main AI)       │     │ (Queue)         │
└─────────────┘     └─────────────────┘     └────────┬────────┘
                                                      │
              ┌───────────────────────────────────────┘
              │
        ┌─────▼─────┐     ┌─────────────────┐     ┌────────────────┐
        │ Cache     │────▶│ Google Gemini   │────▶│ Response       │
        │ (Check)   │     │ API             │     │ Processing     │
        └───────────┘     └─────────────────┘     └────────────────┘
```

---

## Key Architectural Patterns

### 1. Lazy Loading Strategy

```typescript
// AppRouter.tsx - All screens lazy loaded
const FeedScreen = lazy(() => import('../../screens/FeedScreen'));
const HomeScreen = lazy(() => import('../../screens/HomeScreen'));
const LibraryScreen = lazy(() => import('../../screens/LibraryScreen'));
// ...

// Wrapped in Suspense with screen-specific skeleton
<Suspense fallback={<ScreenSpecificSkeleton screen={activeScreen} />}>
  {renderScreen()}
</Suspense>
```

### 2. Context Composition

```typescript
// AppProviders.tsx
export const AppProviders = ({ children }) => (
  <UserProvider>
    <SettingsProvider>
      <DataProvider>
        <NavigationProvider>
          <FocusProvider>
            <CalendarProvider>
              <ToastProvider>
                <UIProvider>
                  {children}
                </UIProvider>
              </ToastProvider>
            </CalendarProvider>
          </FocusProvider>
        </NavigationProvider>
      </DataProvider>
    </SettingsProvider>
  </UserProvider>
);
```

### 3. IndexedDB Object Stores

```typescript
// services/db/indexedDBCore.ts
export const OBJECT_STORES = [
  'personalItems',
  'feedItems', 
  'spaces',
  'tags',
  'templates',
  'rssFeeds',
  'watchlist',
  'authTokens',
  'bodyWeight',
  'workoutSessions',
  'workoutTemplates',
  'personalExercises',
  'quotes'
];
```

### 4. Premium UI Components

```typescript
// Common pattern across components
const PremiumButton = ({ gradient, glow, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      'bg-gradient-to-r',
      gradient,
      'shadow-glow'
    )}
    style={{ '--glow-color': glow }}
    {...props}
  />
);
```

---

## API Integrations Summary

| API | Service File | Usage | Rate Limits |
|-----|--------------|-------|-------------|
| **Google Gemini** | `geminiService.ts` | AI features | 30 req/min |
| **Firebase Auth** | `authService.ts` | Authentication | Unlimited |
| **Firestore** | `firestoreService.ts` | Cloud sync | 50K reads/day (free) |
| **Google Calendar** | `googleCalendarService.ts` | Calendar sync | OAuth required |
| **Google Drive** | `googleDriveService.ts` | Backup | OAuth required |
| **Google Tasks** | `googleTasksService.ts` | Task sync | OAuth required |
| **Alpha Vantage** | `financialsService.ts` | Stocks | 5 req/min, 25/day |
| **FreeCryptoAPI** | `financialsService.ts` | Crypto | Limited |
| **RSS Proxies** | `rssService.ts` | Feed fetching | Varies |

---

## Environment Variables

```env
# .env.local
VITE_GEMINI_API_KEY=           # Required for AI features
VITE_FIREBASE_API_KEY=         # Firebase project
VITE_FIREBASE_AUTH_DOMAIN=     
VITE_FIREBASE_PROJECT_ID=      
VITE_FIREBASE_STORAGE_BUCKET=  
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=          
VITE_GOOGLE_CLIENT_ID=         # Google OAuth
VITE_ALPHA_VANTAGE_API_KEY=    # Stock data (optional)
```

---

## Testing Architecture

```
tests/
├── components/           # Component tests
├── services/             # Service tests
├── hooks/                # Hook tests
├── utils/                # Utility tests
└── integration/          # E2E tests
```

**Test Commands:**
```bash
npm run test              # Run all tests
npm run test:coverage     # With coverage report
```

---

## Performance Optimizations

| Optimization | Location | Impact |
|--------------|----------|--------|
| **React.memo** | All screens, major components | Prevent re-renders |
| **useMemo/useCallback** | Data transformations | Memoization |
| **Lazy loading** | `AppRouter.tsx` | Initial bundle |
| **Virtuoso** | `FeedScreen.tsx` | Long lists |
| **Code splitting** | `vite.config.ts` | Chunking |
| **Response caching** | `geminiService.ts` | AI calls |
| **IndexedDB** | All data | Persistent cache |
| **rafThrottle** | Scroll handlers | Animation frames |

---

## AI Navigation Quick Reference

### כשמבקשים לשנות משהו:

| Topic | Primary Files | Secondary Files |
|-------|---------------|-----------------|
| **UI/Design** | `src/design-tokens.css`, `tailwind.config.js` | Component CSS files |
| **New Screen** | `screens/`, `AppRouter.tsx` | `BottomNavBar.tsx` |
| **New Item Type** | `types.ts`, `constants.ts`, `ItemCreationForm.tsx` | DataContext, DB service |
| **AI Feature** | `geminiService.ts`, `services/ai/` | Relevant component |
| **Settings** | `settingsService.ts`, `components/settings/` | `settingsRegistry.tsx` |
| **Workout** | `components/workout/`, `workoutDb.ts` | `WorkoutSession` type |
| **Investments** | `financialsService.ts`, `InvestmentsScreen.tsx` | `WatchlistItem` type |
| **Authentication** | `authService.ts`, `UserContext.tsx` | Firebase config |
| **Cloud Sync** | `firestoreService.ts`, `cloudSyncService.ts` | DataContext |
| **Notifications** | `notificationsService.ts`, settings | Hooks |

---

> **Last Updated:** December 16, 2025  
> **Total Files:** ~400+ source files  
> **Total Lines of Code:** ~100,000+ LOC  
> **Documentation Depth:** Function-level with architectural patterns

---

---

## 🔬 Ultra-Deep Analysis - Implementation Details

### useSound.ts (353 lines) - Web Audio API Hook

**Sound Effect Library Architecture:**

```typescript
// Singleton AudioContext (shared across all sound instances)
let audioCtx: AudioContext | null = null;

// Sound Types Available:
type SoundPreset = 'minimal' | 'modern' | 'playful' | 'retro';

// Preset Configurations:
const PRESETS = {
  minimal: { volumeMultiplier: 0.3, pitchMultiplier: 1.2 },
  modern:  { volumeMultiplier: 0.5, pitchMultiplier: 1.0 },
  playful: { volumeMultiplier: 0.7, pitchMultiplier: 0.9 },
  retro:   { volumeMultiplier: 0.6, pitchMultiplier: 0.8 },
};
```

**Available Sound Functions:**

| Category | Function | Music Notes | Use Case |
|----------|----------|-------------|----------|
| **UI Interaction** | `playClick()` | 800Hz→400Hz sine | Button clicks |
| | `playPop()` | 300Hz→600Hz sine | Popup appear |
| | `playToggle(isOn)` | 600Hz/300Hz | Toggle switches |
| **Feedback** | `playSuccess()` | A4→C#5→E5 major arpeggio | Task complete |
| | `playError()` | A4→F4→D4 minor descend | Validation fail |
| | `playWarning()` | 880/660/880Hz triangle | Alert |
| | `playNotification()` | C5→E5→G5 chime | Push notification |
| **Progress** | `playComplete()` | C5→E5→G5→C6 fanfare | Goal reached |
| | `playLevelUp()` | C4 scale + sparkle | Achievement unlock |
| | `playStreak(count)` | Dynamic pitch | Streak milestone |
| **Navigation** | `playSwipe(direction)` | Stereo pan effect | Gesture feedback |
| | `playOpen()` | 200→400Hz whoosh | Modal open |
| | `playClose()` | 400→200Hz whoosh | Modal close |
| **Timer** | `playTick()` | 1000Hz brief | Timer tick |
| | `playTimerEnd()` | 880/698Hz alarm | Pomodoro complete |

---

### useWorkoutTimer.ts (413 lines) - Timer State Machine

**State Machine:**

```
        ┌────────────────────────────────────────────────┐
        │                                                │
        ▼                                                │
    ┌───────┐   start()   ┌─────────┐   pause()   ┌──────────┐
    │ idle  │────────────▶│ running │────────────▶│  paused  │
    └───────┘             └────┬────┘             └────┬─────┘
        ▲                      │                       │
        │                      │ interval complete     │ resume()
        │                      ▼                       │
        │                 ┌─────────┐                  │
        │                 │  rest   │◀─────────────────┘
        │                 └────┬────┘
        │                      │ rest complete OR rounds complete
        │                      ▼
        │                ┌──────────┐
        └────────────────│ finished │
                         └──────────┘
```

**Timer Modes:**

| Mode | Behavior | Use Case |
|------|----------|----------|
| `stopwatch` | Counts up from 0 | General timing |
| `countdown` | Counts down to 0 | Rest timer |
| `interval` | Alternates work/rest | HIIT training |

**Interval Configuration:**

```typescript
interface IntervalConfig {
  workDuration: number;    // seconds
  restDuration: number;    // seconds
  rounds: number;          // 0 = infinite
  prepareTime?: number;    // countdown before start
}
```

**Returned Values:**

| Property | Type | Description |
|----------|------|-------------|
| `time` | number | Current seconds |
| `formattedTime` | string | "MM:SS" or "HH:MM:SS" |
| `state` | TimerState | Current state |
| `isRunning` | boolean | Active timer |
| `isRest` | boolean | In rest period |
| `currentRound` | number | Current interval |
| `intervalProgress` | number | 0-1 progress |
| `laps` | Lap[] | Recorded laps |
| `bestLap` | Lap | Fastest lap |
| `averageLapTime` | number | Mean lap duration |

**Controls:**

```typescript
start()        // Begin timer
pause()        // Pause
resume()       // Resume from pause
toggle()       // Toggle pause/resume
stop()         // Stop and reset
reset()        // Full reset including laps
addTime(n)     // Add/subtract seconds
recordLap()    // Record lap time
skipInterval() // Skip to next work/rest
```

---

### appReducer.ts (223 lines) - Global App Reducer

**Action Types (23 total):**

```typescript
type AppAction =
  // Loading
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { feedItems, personalItems, spaces } }
  | { type: 'FETCH_ERROR'; payload: string }
  
  // Feed Items
  | { type: 'ADD_FEED_ITEM'; payload: FeedItem }
  | { type: 'UPDATE_FEED_ITEM'; payload: { id, updates } }
  | { type: 'BATCH_UPDATE_FEED_ITEMS'; payload: { id, updates }[] }
  | { type: 'REMOVE_FEED_ITEM'; payload: string }
  
  // Personal Items
  | { type: 'ADD_PERSONAL_ITEM'; payload: PersonalItem }
  | { type: 'UPDATE_PERSONAL_ITEM'; payload: { id, updates } }
  | { type: 'REMOVE_PERSONAL_ITEM'; payload: string }
  | { type: 'SET_ALL_DATA'; payload: { feedItems, personalItems, spaces } }
  
  // Settings
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_LAST_ADDED_TYPE'; payload: AddableType }
  
  // Spaces
  | { type: 'ADD_SPACE'; payload: Space }
  | { type: 'UPDATE_SPACE'; payload: { id, updates } }
  | { type: 'REMOVE_SPACE'; payload: string }
  | { type: 'SET_SPACES'; payload: Space[] }
  
  // Focus Session
  | { type: 'START_FOCUS_SESSION'; payload: PersonalItem }
  | { type: 'CLEAR_FOCUS_SESSION' }
  
  // Google Integration
  | { type: 'SET_GOOGLE_AUTH_STATE'; payload: 'loading' | 'signedIn' | 'signedOut' }
  | { type: 'SET_CALENDAR_EVENTS'; payload: GoogleCalendarEvent[] }
  
  // UI State
  | { type: 'SET_SPLIT_VIEW_CONFIG'; payload: Partial<SplitViewConfig> }
  | { type: 'SET_UNSAVED_CHANGES' }
  | { type: 'CLEAR_UNSAVED_CHANGES' }
  | { type: 'SET_USER'; payload: User | null };
```

**Initial State:**

```typescript
const initialState: AppState = {
  isLoading: true,
  error: null,
  feedItems: [],
  personalItems: [],
  spaces: [],
  settings: loadSettings(),           // From settingsService
  focusSession: null,
  googleAuthState: 'loading',
  calendarEvents: [],
  splitViewConfig: { isActive: false, left: 'dashboard', right: 'feed' },
  hasUnsavedChanges: false,
  user: null,
};
```

---

### indexedDBCore.ts (264 lines) - Database Core

**Database Configuration:**

```typescript
export const DB_NAME = 'SparkDB';
export const DB_VERSION = 3;
export const OBJECT_STORES = [
  'personalItems', 'feedItems', 'spaces', 'tags', 'templates',
  'rssFeeds', 'watchlist', 'authTokens', 'bodyWeight',
  'workoutSessions', 'workoutTemplates', 'personalExercises', 'quotes'
];
```

**Connection Pooling:**

```typescript
let dbPromise: Promise<IDBDatabase> | null = null;   // Singleton promise
let dbInstance: IDBDatabase | null = null;            // Cached connection

// Features:
// - Memoized connection (reuses existing if available)
// - Auto-reconnect on close
// - Version change handling (multi-tab support)
// - Blocked upgrade detection
```

**Generic CRUD Functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `dbGetAll<T>` | `(storeName) → Promise<T[]>` | Get all items |
| `dbGet<T>` | `(storeName, key) → Promise<T>` | Get by key |
| `dbPut<T>` | `(storeName, item) → Promise<void>` | Upsert item |
| `dbDelete` | `(storeName, key) → Promise<void>` | Delete by key |
| `dbClear` | `(storeName) → Promise<void>` | Clear store |

**Retry Logic:**

```typescript
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 100
): Promise<T> => {
  // Exponential backoff: 100ms, 200ms, 400ms
  // Logs each retry attempt
  // Throws last error after all retries fail
};

// Sync wrapper for fire-and-forget cloud sync
const syncWithRetry = (operation, operationName) => {
  withRetry(operation, 3, 500).catch(error => {
    console.error(`Cloud sync failed after retries (${operationName}):`, error);
  });
};
```

---

### settingsRegistry.tsx (245 lines) - Searchable Settings Index

**Settings Categories (17):**

```typescript
type SettingsCategory =
  | 'profile' | 'appearance' | 'behavior' | 'interface'
  | 'focus' | 'workout' | 'ai' | 'sync' | 'data' | 'about'
  | 'notifications' | 'calendar' | 'tasks' | 'smart'
  | 'accessibility' | 'privacy' | 'comfort-zone';

type SettingsGroup = 
  | 'personalization' | 'productivity' | 'style' 
  | 'system' | 'intelligence' | 'wellbeing';
```

**Category Visual Config:**

```typescript
interface CategoryInfo {
  id: SettingsCategory;
  title: string;              // Hebrew title
  icon: React.ReactNode;      // Icon component
  gradient: [string, string]; // Gradient colors
  count: number;              // Number of settings
  group: SettingsGroup;       // Grouping
}
```

**Settings Registry Structure:**

```typescript
interface SettingItem {
  id: string;                  // Unique identifier
  title: string;               // Hebrew display name
  description: string;         // Hebrew description
  keywords: string[];          // Search terms (Hebrew + English)
  category: SettingsCategory;  // Category assignment
  type: 'toggle' | 'select' | 'slider' | 'action' | 'link';
}

// Example setting:
{
  id: 'theme',
  title: 'ערכת נושא',
  description: 'בחר את העיצוב הכללי',
  keywords: ['ערכה', 'נושא', 'theme', 'עיצוב', 'צבע'],
  category: 'appearance',
  type: 'action'
}
```

**Search Function:**

```typescript
function searchSettings(query: string): SettingItem[] {
  // Fuzzy search across:
  // - title (Hebrew)
  // - description (Hebrew)
  // - keywords (Hebrew + English)
  // Returns max 10 results
}
```

---

### WorkoutProvider.tsx (299 lines) - Workout State Management

**Technology Stack:**

- **State:** `useImmerReducer` (immutable updates with mutable syntax)
- **Persistence:** localStorage with `STORAGE_KEY = 'active_workout_v3_state'`
- **Wake Lock:** Uses Web Lock API to prevent screen sleep
- **Haptic Feedback:** Vibration patterns for feedback

**Workout State Structure:**

```typescript
interface WorkoutState {
  exercises: WorkoutExercise[];
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimeRemaining: number;
  totalVolume: number;
  startTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  completedSets: number;
  personalRecords: PersonalRecord[];
  // ... more fields
}
```

**Key Actions:**

| Action | Effect |
|--------|--------|
| `ADD_EXERCISE` | Add exercise to workout |
| `REMOVE_EXERCISE` | Remove exercise |
| `COMPLETE_SET` | Mark set done, calculate volume |
| `START_REST` | Begin rest timer |
| `SKIP_REST` | Skip remaining rest |
| `UPDATE_SET` | Modify weight/reps |
| `REORDER_EXERCISES` | Drag-and-drop reorder |
| `FINISH_WORKOUT` | Calculate summary, save |

**Wake Lock Implementation:**

```typescript
const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.log('Wake Lock failed:', err);
    }
  }
};
```

---

### Workout Hooks (7 specialized hooks)

| Hook | File | Purpose |
|------|------|---------|
| `usePRs` | `usePRs.ts` | Simple PR check for current exercise |
| `usePersonalRecords` | `usePersonalRecords.ts` | Full PR management with history |
| `usePreviousData` | `usePreviousData.ts` | Last workout for same exercise |
| `useWorkoutAudio` | `useWorkoutAudio.ts` | Audio cues (countdown, rest end) |
| `useWorkoutHistory` | `useWorkoutHistory.ts` | Query past workouts |
| `useWorkoutTimer` | `useWorkoutTimer.ts` | Rest timer with countdown |

---

### PersonalItemDetailModal.tsx (567 lines) - Item Detail Views

**View Mode per Item Type:**

```typescript
// Dynamic view/edit rendering based on item.type
switch (item.type) {
  case 'task':     return <TaskView ... />;
  case 'habit':    return <HabitView ... />;
  case 'note':     return <NoteView ... />;
  case 'book':     return <BookView ... />;
  case 'learning': return <LearningView ... />;
  case 'roadmap':  return <RoadmapView ... />;
  case 'antigoal': return <AntiGoalView ... />;
  default:         return <GenericView ... />;
}
```

**Features:**
- Related items fetching (same space/tags)
- AI icon suggestions
- Attachment gallery view
- Markdown content support
- Auto-save on edit

---

### vite.config.ts (257 lines) - Build Configuration

**Manual Chunking Strategy:**

```typescript
manualChunks(id) {
  // Framework chunks
  if (id.includes('react')) return 'vendor-react';
  if (id.includes('framer-motion')) return 'vendor-animation';
  
  // Firebase chunks (large)
  if (id.includes('firebase')) return 'vendor-firebase';
  
  // Visualization
  if (id.includes('chart') || id.includes('recharts')) return 'vendor-charts';
  
  // Virtualization
  if (id.includes('virtuoso')) return 'vendor-virtualization';
  
  // AI
  if (id.includes('@google/genai')) return 'vendor-ai';
  
  // Components by feature
  if (id.includes('/workout/')) return 'feature-workout';
  if (id.includes('/settings/')) return 'feature-settings';
  // ...
}
```

**PWA Configuration:**

```typescript
VitePWA({
  registerType: 'autoUpdate',
  strategies: 'injectManifest',
  manifest: {
    name: 'Spark OS',
    short_name: 'Spark',
    theme_color: '#0E0B09',
    display: 'standalone',
    icons: [...],
    shortcuts: [
      { name: 'New Task', url: '/?action=new_task' },
      { name: 'Calendar', url: '/?action=calendar' },
    ],
  },
});
```

---

## 📊 Code Metrics Summary

| Metric | Count |
|--------|-------|
| **Total Files** | ~400+ |
| **Total LOC** | ~100,000+ |
| **React Components** | 295+ |
| **Custom Hooks** | 43+ |
| **Services** | 70+ |
| **TypeScript Types** | 1013 lines |
| **CSS Variables** | 62KB |
| **Settings Items** | 85+ searchable |
| **Reducer Actions** | 23 |
| **IndexedDB Stores** | 13 |
| **Sound Effects** | 16 |

---

## 🎯 Common Code Patterns

### 1. Memoized Callbacks with Dependencies

```typescript
const handleComplete = useCallback(async () => {
  await updateItem(id, { completed: true });
  playSuccess();
}, [id, updateItem, playSuccess]);
```

### 2. Immer Reducer Pattern

```typescript
// Used in WorkoutProvider
const [state, dispatch] = useImmerReducer(reducer, initialState);

// Reducer mutates draft directly (Immer magic)
case 'COMPLETE_SET':
  draft.exercises[draft.currentExerciseIndex].sets[action.setIndex].completed = true;
  draft.completedSets++;
  break;
```

### 3. Lazy Loading with Suspense

```typescript
const Screen = lazy(() => import('./screens/Screen'));

<Suspense fallback={<ScreenSkeleton />}>
  <Screen />
</Suspense>
```

### 4. Context with Performance Split

```typescript
// Separate contexts for frequently-changing data
const TimerValueContext = createContext(0);         // Re-renders often
const TimerControlsContext = createContext({});     // Rarely re-renders

// Components subscribe only to what they need
const timer = useContext(TimerValueContext);
const { pause, resume } = useContext(TimerControlsContext);
```

### 5. Optimistic Updates with Rollback

```typescript
// Update UI immediately
setItems(prev => [...prev, newItem]);

try {
  await saveToDatabase(newItem);
} catch (error) {
  // Rollback on failure
  setItems(prev => prev.filter(i => i.id !== newItem.id));
  showError('שמירה נכשלה');
}
```

---

> **Last Updated:** December 16, 2025  
> **Total Files:** ~400+ source files  
> **Total Lines of Code:** ~100,000+ LOC  
> **Documentation Depth:** Ultra-deep with code examples and state machines

---

---

## 🔐 Security & Encryption System

### cryptoService.ts (262 lines)

**Encryption Architecture:**

```
┌────────────────────────────────────────────────────────────────┐
│                    PASSWORD MANAGER VAULT                       │
├────────────────────────────────────────────────────────────────┤
│  Master Password                                                │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────┐                                                │
│  │  PBKDF2     │  Salt + 100K iterations                        │
│  │  (SHA-256)  │                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐     ┌─────────────┐                           │
│  │ Vault Key   │────▶│ AES-256-GCM │────▶ Encrypted Vault      │
│  └─────────────┘     └─────────────┘                           │
│         │                                                       │
│  ┌──────┴──────┐                                                │
│  │ Sensitive   │  Secondary key for extra-sensitive passwords  │
│  │ Item Key    │  (100K iterations with combined salt)          │
│  └─────────────┘                                                │
└────────────────────────────────────────────────────────────────┘
```

**Crypto Functions:**

| Function | Purpose | Algorithm |
|----------|---------|-----------|
| `deriveKey()` | Password → Key | PBKDF2-SHA256 |
| `deriveSensitiveKey()` | Secondary key for sensitive items | PBKDF2 with combined salt |
| `encryptString()` | Encrypt data | AES-256-GCM |
| `decryptToString()` | Decrypt data | AES-256-GCM |
| `generatePassword()` | Random password | crypto.getRandomValues |
| `checkPwnedPassword()` | Breach check | HIBP API (k-anonymity) |

**Password Generation Options:**

```typescript
interface GeneratePasswordOptions {
  length?: number;        // Default: 18
  numbers?: boolean;      // Include 0-9
  symbols?: boolean;      // Include !@#$%^&*...
  uppercase?: boolean;    // Include A-Z
  lowercase?: boolean;    // Include a-z
}
```

**HIBP Integration (k-anonymity):**

```typescript
// Checks if password was in a breach WITHOUT sending the password
async function checkPwnedPassword(password: string): Promise<boolean> {
  const hash = await sha1(password);
  const prefix = hash.substring(0, 5);  // Send only first 5 chars
  const suffix = hash.substring(5);      // Check locally
  
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  // Check if suffix exists in response
}
```

---

## 📰 RSS Feed System

### rssService.ts (173 lines)

**CORS Proxy Rotation:**

```typescript
const CORS_PROXIES = [
  'https://api.cors.lol/?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url=',
];

// Tries each proxy until one succeeds
for (const proxy of CORS_PROXIES) {
  try {
    const xml = await fetchAsText(`${proxy}${encodeURIComponent(feedUrl)}`);
    return parseRssXml(xml);
  } catch { continue; }
}
```

**XML Sanitization:**

```typescript
function sanitizeXmlBeforeParsing(xml: string): string {
  // Remove control characters
  xml = xml.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  // Fix unescaped ampersands
  xml = xml.replace(/&(?!(?:[a-z]+|#[0-9]+);)/gi, '&amp;');
  // Fix unquoted attributes
  // Remove namespace prefixes
  return xml;
}
```

**HTML Content Stripping:**

```typescript
function stripHtml(htmlString: string): string {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  
  // Remove dangerous elements
  doc.querySelectorAll('script, style, iframe').forEach(el => el.remove());
  
  // Convert lists to bullets
  doc.querySelectorAll('li').forEach(li => li.prepend('• '));
  
  return doc.body.textContent.trim();
}
```

**Supported Feed Formats:**
- RSS 2.0 (`<item>` elements)
- Atom (`<entry>` elements)

---

## 🔗 Google Integrations

### googleCalendarService.ts (202 lines)

**API Endpoints:**

```typescript
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

// Uses Firebase Auth access token
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getGoogleAccessToken()}`,
  'Content-Type': 'application/json',
});
```

**Available Functions:**

| Function | HTTP | Description |
|----------|------|-------------|
| `isCalendarConnected()` | - | Check token validity |
| `getEventsForDateRange()` | GET | Get events in range |
| `createEvent()` | POST | Create new event |
| `updateEvent()` | PUT | Update existing event |
| `deleteEvent()` | DELETE | Delete event |
| `blockTimeForTask()` | POST | Create time block |

**Time Blocking Feature:**

```typescript
// Creates a calendar event linked to a Spark task
export const blockTimeForTask = async (
  taskId: string,
  taskTitle: string,
  startTime: Date,
  durationMinutes: number
): Promise<GoogleCalendarEvent> => {
  return createEvent({
    summary: `🎯 ${taskTitle}`,
    description: `Time blocked for task: ${taskTitle}`,
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: endTime.toISOString() },
    sparkTaskId: taskId,     // Custom metadata
    isBlockedTime: true,
  });
};
```

### googleDriveService.ts - Backup System

**Backup Flow:**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Export Data │────▶│  Encrypt    │────▶│ Upload to   │
│ (JSON)      │     │  (Optional) │     │ Google Drive│
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                        spark-backup-{date}.json
                                        (in SparkOS folder)
```

### googleTasksService.ts - Task Sync

**Bidirectional Sync:**
- Import Google Tasks → Spark tasks
- Export Spark tasks → Google Tasks
- Real-time updates on changes

---

## 🔔 Notifications System

### notificationsService.ts (151 lines)

**Notification Flow:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Request         │────▶│ Show via        │────▶│ Update App      │
│ Permission      │     │ Service Worker  │     │ Badge           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        ▼                                               ▼
   'granted'/'denied'                          setAppBadge(count)
```

**Available Functions:**

| Function | Purpose |
|----------|---------|
| `isSupported()` | Check browser support |
| `requestPermission()` | Request user permission |
| `showNotification()` | Display notification via SW |
| `showTestNotification()` | Test notification |
| `updateAppBadge(count)` | Update PWA app icon badge |
| `registerPeriodicSync()` | Background feed sync (12hr) |
| `subscribeToPush()` | Subscribe to push notifications |

**Periodic Background Sync:**

```typescript
await registration.periodicSync.register('feed-sync', {
  minInterval: 12 * 60 * 60 * 1000, // 12 hours
});
```

**App Badge API:**

```typescript
// Update PWA icon badge with unread count
if ('setAppBadge' in navigator) {
  if (count > 0) {
    navigator.setAppBadge(count);
  } else {
    navigator.clearAppBadge();
  }
}
```

---

## 🎨 Design Token System

### design-tokens.css (2668 lines, 62KB)

**Token Categories:**

```css
:root {
  /* ═══════════════════════════════════════════════════════════════
     COLOR SYSTEM - Deep Cosmos Palette
     ═══════════════════════════════════════════════════════════════ */
  
  /* Base Colors - Deep blacks for luxury feel */
  --color-cosmos-black: #0A0A0F;
  --color-cosmos-void: #13131A;
  --color-cosmos-depth: #1A1A26;
  --color-cosmos-surface: #1F1F2E;
  
  /* Accent System - High-end gradients */
  --color-accent-cyan: #00F0FF;
  --color-accent-violet: #7B61FF;
  --color-accent-magenta: #FF006E;
  --color-accent-gold: #FFB800;
  
  /* Neutrals - White opacity layers (50-900) */
  --color-gray-50 through --color-gray-900
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
}
```

**Typography Scale (Major Third 1.250):**

| Token | Size | Use Case |
|-------|------|----------|
| `--font-size-xs` | 10.24px | Captions |
| `--font-size-sm` | 12.8px | Labels |
| `--font-size-base` | 16px | Body text |
| `--font-size-lg` | 20px | Large text |
| `--font-size-xl` | 25px | Subheadings |
| `--font-size-2xl` | 31px | Headings |
| `--font-size-3xl` | 39px | Large headings |
| `--font-size-4xl` | 49px | Hero text |

**Spacing System (4px base):**

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
/* ... up to --space-32: 8rem (128px) */

/* Semantic aliases */
--gap-tight: var(--space-2);
--gap-base: var(--space-4);
--padding-card: var(--space-5);
```

**Motion System:**

```css
/* Easing Functions */
--ease-spring-stiff: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-spring-soft: cubic-bezier(0.175, 0.885, 0.32, 1.275);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Duration Scale */
--duration-fast: 150ms;
--duration-base: 250ms;
--duration-slow: 400ms;
```

**Elevation & Shadows:**

```css
/* Depth Shadows */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.6);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.65);

/* Glow Shadows - for premium accents */
--shadow-glow-cyan: 0 0 20px rgba(0, 240, 255, 0.4);
--shadow-glow-violet: 0 0 20px rgba(123, 97, 255, 0.4);
```

**Glass Utilities:**

```css
.glass {
  background: var(--color-gray-50);
  backdrop-filter: blur(var(--blur-xl));
  border: 1px solid var(--color-gray-100);
  box-shadow: var(--shadow-lg);
}

.glass-heavy { /* More opaque */ }
.glass-subtle { /* More transparent */ }
.glass-nav { /* Optimized for navigation */ }
```

**Premium Animations:**

| Animation | Use Case |
|-----------|----------|
| `premium-fade-in` | General entrance |
| `premium-scale-in` | Modal/popup entrance |
| `premium-slide-up` | Bottom sheet entrance |
| `glow-pulse` | Active/focus states |
| `shimmer` | Loading states |
| `float` | FAB hover |
| `bounce-in` | Success feedback |
| `shake` | Error feedback |

**Mobile-First Variables:**

```css
/* Safe navigation dimensions */
--nav-height: 88px;
--content-bottom-spacing: calc(var(--nav-height) + env(safe-area-inset-bottom));

/* Touch targets (Android standard) */
--touch-target-min: 48px;
--touch-target-comfortable: 56px;
```

---

## 📦 Complete File Inventory

### By Line Count (Top 20)

| File | Lines | Purpose |
|------|-------|---------|
| `design-tokens.css` | 2668 | Design system |
| `geminiService.ts` | 1828 | AI service |
| `financialsService.ts` | 1681 | Investment tracking |
| `ItemCreationForm.tsx` | 1357 | Form component |
| `LibraryScreen.tsx` | 1232 | Library screen |
| `types.ts` | 1013 | Type definitions |
| `firestoreService.ts` | 847 | Cloud sync |
| `FocusContext.tsx` | 833 | Pomodoro timer |
| `FeedScreen.tsx` | 739 | Feed screen |
| `ActiveWorkoutNew.tsx` | 691 | Workout UI |

### Service Layer Map

```
services/
├── ai/                      # AI services (12 files)
│   ├── geminiClient.ts      # API client
│   ├── chatService.ts       # Chat logic
│   ├── rateLimiter.ts       # Rate limiting
│   └── responseCache.ts     # Caching
├── db/                      # Database (9 files)
│   ├── indexedDBCore.ts     # Core operations
│   ├── personalItemsDb.ts   # Items CRUD
│   └── workoutDb.ts         # Workout data
├── data/                    # Business logic (9 files)
│   ├── personalItemsService.ts
│   └── workoutService.ts
└── [30 root services]       # Core services
    ├── geminiService.ts     # Main AI
    ├── firestoreService.ts  # Cloud sync
    ├── cryptoService.ts     # Encryption
    ├── rssService.ts        # RSS parsing
    └── notificationsService.ts
```

---

> **Last Updated:** December 16, 2025  
> **Total Files:** ~400+ source files  
> **Total Lines of Code:** ~100,000+ LOC  
> **Documentation Depth:** Complete system documentation with encryption, integrations, and design tokens
