# Spark OS - Complete Settings Documentation

A comprehensive reference document explaining every setting in Spark OS, its purpose, and implementation status.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | **Connected & Working** - Setting affects app behavior |
| ⚠️ | **UI Only** - Saved but not connected to any functionality |
| 🔧 | **Partially Working** - Some functionality connected |

---

## 1. 📱 Profile Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Username** | `userName` | Your display name shown in greetings and throughout the app | ✅ Working |
| **User Emoji** | `userEmoji` | Avatar emoji representing you in the app | ✅ Working |

---

## 2. 🎨 Appearance Settings (`themeSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Theme Name** | `themeSettings.name` | Name of the selected theme (Aurora, Sunset, Ocean, etc.) | ✅ Working |
| **Accent Color** | `themeSettings.accentColor` | Primary color used for buttons, highlights, and interactive elements | ✅ Working |
| **Font** | `themeSettings.font` | Typography font family (Satoshi, Clash Display, Inter, etc.) | ✅ Working - Connected via `useThemeEffect.ts` |
| **Font Weight** | `themeSettings.fontWeight` | Text weight (normal, medium, bold) | ✅ Working - Connected via `useThemeEffect.ts` |
| **Card Style** | `themeSettings.cardStyle` | Visual style of cards (glass, flat, bordered) | ✅ Working - Applied via CSS classes |
| **Background Effect** | `themeSettings.backgroundEffect` | Background animation (particles, dark, off) | ✅ Working |
| **Border Radius** | `themeSettings.borderRadius` | Corner roundness of elements (none, sm, md, lg, xl) | ✅ Working |
| **Gradient Colors** | `themeSettings.gradientStart/End` | Gradient colors for buttons and accents | ✅ Working |
| **Glow Color** | `themeSettings.glowColor` | Color for glow effects around elements | ✅ Working |


---

## 3. 🔊 Behavior Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|

| **Haptic Feedback** | `hapticFeedback` | Vibration feedback on button presses and actions | ⚠️ UI Only - Needs navigator.vibrate implementation |
| **Animation Intensity** | `animationIntensity` | Level of animations (off, subtle, default, full) | ⚠️ UI Only - Not connected to motion system |
| **UI Density** | `uiDensity` | Spacing between elements (compact, comfortable, spacious) | ⚠️ UI Only - Not connected to layout |
| **Tooltip Delay** | `tooltipDelay` | How fast tooltips appear (instant, fast, normal, slow) | ⚠️ UI Only |
| **Show Streaks** | `visualSettings.showStreaks` | Display streak counters on habits | ⚠️ UI Only - Needs connection to habit cards |

---

## 4. 🖥️ Interface Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|

| **Screen Labels** | `screenLabels` | Custom Hebrew names for each screen | ✅ Working |
| **Home Screen Layout** | `homeScreenLayout` | Which widgets appear on Today screen and their visibility | ✅ Working |
| **Section Labels** | `sectionLabels` | Custom names for home screen sections | ✅ Working |
| **Add Screen Layout** | `addScreenLayout` | Which item types appear in quick create menu | ✅ Working |
| **Hide Quick Templates** | `hideQuickTemplates` | Hide template section on add screen | ⚠️ UI Only |

---

## 5. 🔔 Notification Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Notifications Enabled** | `notificationsEnabled` | Master switch for all notifications | ✅ Working - Connected in `notificationUtils.ts` |
| **Task Reminders** | `taskRemindersEnabled` | Get reminders before task due dates | ✅ Working - Connected in `useTaskReminders.ts` |
| **Task Reminder Time** | `taskReminderTime` | Minutes before due date to remind (5, 15, 30, 60) | ✅ Working |
| **Habit Reminders** | `enableHabitReminders` | Daily reminders for habits | ✅ Working - Connected in `useHabitReminders.ts` |
| **Daily Digest** | `dailyDigestEnabled` | Evening summary of your day's tasks | ✅ Working - Connected in `useDailyDigest.ts` |
| **Daily Digest Time** | `dailyDigestTime` | Time to send daily digest (HH:mm) | ✅ Working |
| **Weekly Review** | `weeklyReviewEnabled` | Weekly progress summary notification | ✅ Working - Connected in `useWeeklyReview.ts` |
| **Weekly Review Day** | `weeklyReviewDay` | Which day to send weekly review (0=Sunday) | ✅ Working |
| **Quiet Hours** | `quietHoursEnabled` | Mute notifications during specific hours | ✅ Working - Connected in `notificationUtils.ts` |
| **Quiet Hours Start/End** | `quietHoursStart/End` | Start and end time for quiet hours | ✅ Working |
| **Celebrate Completions** | `celebrateCompletions` | Show confetti animation on task completion | ✅ Working - Connected in `StatusMessage.tsx` |

---

## 6. 📅 Calendar Settings (`calendarSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Week Starts On** | `weekStartsOn` | First day of the week (0=Sunday, 1=Monday, 6=Saturday) | ⚠️ UI Only - Should connect to date-fns |
| **Time Format** | `timeFormat` | 12-hour or 24-hour clock display | ⚠️ UI Only - Needs format integration |
| **Date Format** | `dateFormat` | How dates display (DD/MM/YYYY, MM/DD/YYYY, etc.) | ⚠️ UI Only - Needs format integration |
| **Show Week Numbers** | `showWeekNumbers` | Display week numbers in calendar view | ⚠️ UI Only - Needs calendar component update |
| **Default Event Duration** | `defaultEventDuration` | Default length for new events in minutes | ⚠️ UI Only - Needs event creation integration |
| **Default Reminder Time** | `defaultReminderTime` | Minutes before event to send reminder | ⚠️ UI Only |
| **Working Hours Enabled** | `workingHoursEnabled` | Highlight working hours in calendar | ⚠️ UI Only |
| **Working Hours Start/End** | `workingHoursStart/End` | Define work day boundaries | ⚠️ UI Only |

---

## 7. ✅ Task Settings (`taskSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Default Priority** | `defaultPriority` | Priority for new tasks (low, medium, high) | ⚠️ UI Only - Needs task creation integration |
| **Default Due Time** | `defaultDueTime` | Default time when setting task due dates | ⚠️ UI Only |
| **Auto-Schedule Overdue** | `autoScheduleOverdue` | Automatically move overdue tasks to today | ⚠️ UI Only - Needs daily check logic |
| **Show Subtask Progress** | `showSubtaskProgress` | Display completion percentage on parent tasks | ⚠️ UI Only - Needs task card update |
| **Auto-Archive Completed** | `autoArchiveCompleted` | Archive completed tasks after X days | ⚠️ UI Only - Needs background job |
| **Auto-Archive Days** | `autoArchiveDays` | Days to wait before auto-archiving (7, 14, 30) | ⚠️ UI Only |
| **Sort Completed to Bottom** | `sortCompletedToBottom` | Move completed tasks to end of list | ⚠️ UI Only - Needs sort logic in task list |
| **Show Task Age** | `showTaskAge` | Display how long task has been open | ⚠️ UI Only - Needs task card update |
| **Natural Language** | `enableNaturalLanguage` | Parse dates from text ("tomorrow", "next week") | ⚠️ UI Only - NLP parser exists but not connected |
| **Default List View** | `defaultListView` | Initial view mode (list, kanban, calendar) | ⚠️ UI Only |

---

## 8. 🧠 Smart Features (`smartFeaturesSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Smart Reminders** | `smartReminders` | AI suggests optimal reminder times based on patterns | ⚠️ UI Only - Needs AI implementation |
| **Auto Tag Suggestions** | `autoTagSuggestions` | AI suggests tags based on content analysis | ⚠️ UI Only - Needs AI implementation |
| **Duplicate Detection** | `duplicateDetection` | Warn when creating similar items | ⚠️ UI Only - Needs comparison logic |
| **Smart Reschedule** | `smartReschedule` | AI suggests better times for tasks | ⚠️ UI Only - Needs AI implementation |
| **AI Writing Assist** | `aiWritingAssist` | AI helps complete sentences and ideas | ⚠️ UI Only - Needs AI integration |
| **Auto Link Detection** | `autoLinkDetection` | Automatically detect and format URLs in text | ⚠️ UI Only - Needs regex parser |
| **Markdown Enabled** | `markdownEnabled` | Enable markdown formatting in notes | ⚠️ UI Only - Needs markdown renderer |
| **Auto Backlinks** | `autoBacklinks` | Automatically create Obsidian-style backlinks | ⚠️ UI Only - Needs linking system |

---

## 9. ⏱️ Focus/Pomodoro Settings

### Interval Timer (`intervalTimerSettings`)
| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Enable Interval Timer** | `enableIntervalTimer` | Show/hide focus timer feature | ✅ Working |
| **Rest Duration** | `restDuration` | Break time in seconds | ✅ Working |
| **Work Duration** | `workDuration` | Focus session time in seconds | ✅ Working |
| **Auto Start Next** | `autoStartNext` | Automatically start next session after break | ✅ Working |

### Pomodoro Settings (`pomodoroSettings`)
| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Work Duration** | `workDuration` | Focus session in minutes | ✅ Working |
| **Short Break** | `shortBreak` | Short break in minutes | ✅ Working |
| **Long Break** | `longBreak` | Long break in minutes | ✅ Working |
| **Sessions Until Long Break** | `sessionsUntilLongBreak` | Number of sessions before long break | ✅ Working |

### Focus Goals (`focusGoalSettings`)
| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Daily Goal Minutes** | `dailyGoalMinutes` | Target focus time per day (30-480 min) | ⚠️ UI Only - Needs progress tracking UI |
| **Weekly Goal Hours** | `weeklyGoalHours` | Target focus time per week (1-40 hours) | ⚠️ UI Only |
| **Block Notifications During Focus** | `blockNotificationsDuringFocus` | Silence notifications during active focus | ⚠️ UI Only - Needs notification suppression |
| **Auto Start Next Session** | `autoStartNextSession` | Automatically begin next focus session | ✅ Working |
| **Show Focus Stats** | `showFocusStats` | Display focus statistics widget | ⚠️ UI Only |
| **Long Break Interval** | `longBreakInterval` | Sessions before long break (2-6) | ✅ Working |
| **Long Break Duration** | `longBreakDuration` | Long break length in minutes (15-60) | ✅ Working |

---

## 10. 🏋️ Workout Settings (`workoutSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Default Rest Time** | `defaultRestTime` | Default rest between sets in seconds | ✅ Working |
| **Default Sets** | `defaultSets` | Default number of sets per exercise | ✅ Working |
| **Sound Enabled** | `soundEnabled` | Audio cues during workout | ✅ Working |
| **Haptics Enabled** | `hapticsEnabled` | Vibration feedback during workout | 🔧 Partially - May need device support |
| **Keep Awake** | `keepAwake` | Prevent screen from sleeping during workout | ✅ Working |
| **OLED Mode** | `oledMode` | Pure black background for OLED screens | ✅ Working - Connected in `ActiveWorkoutNew.tsx` |
| **Default Workout Goal** | `defaultWorkoutGoal` | Default goal type (strength, hypertrophy, endurance, etc.) | ✅ Working |
| **Enable Warmup** | `enableWarmup` | Include warmup in workout | ✅ Working |
| **Enable Cooldown** | `enableCooldown` | Include cooldown in workout | ✅ Working |
| **Warmup Preference** | `warmupPreference` | Always/never/ask for warmup | ✅ Working |
| **Cooldown Preference** | `cooldownPreference` | Always/never/ask for cooldown | ✅ Working |
| **Water Reminder** | `waterReminderEnabled` | Remind to drink water during workout | ⚠️ UI Only |
| **Water Reminder Interval** | `waterReminderInterval` | Minutes between water reminders | ⚠️ UI Only |
| **Workout Reminders** | `workoutRemindersEnabled` | Reminder to workout on scheduled days | ✅ Working |
| **Workout Reminder Time** | `workoutReminderTime` | Time to send workout reminder | ✅ Working |
| **Reminder Days** | `reminderDays` | Which days to send reminders (0-6) | ✅ Working |
| **Selected Theme** | `selectedTheme` | Workout screen color theme | ✅ Working |
| **Track Body Weight** | `trackBodyWeight` | Enable body weight logging | ✅ Working |

---

## 11. 🤖 AI Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **AI Model** | `aiModel` | Which Gemini model to use (gemini-2.0-flash, etc.) | ✅ Working |
| **Auto Summarize** | `autoSummarize` | Automatically summarize long content | ⚠️ UI Only |
| **AI Personality** | `aiPersonality` | AI communication style (encouraging, concise, formal, etc.) | 🔧 Partially - Used in some prompts |

### AI Feed Settings (`aiFeedSettings`)
| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **AI Feed Enabled** | `isEnabled` | Enable AI-generated feed content | ✅ Working |
| **Topics** | `topics` | Topics for AI to generate content about | ✅ Working |
| **Items Per Refresh** | `itemsPerRefresh` | How many AI items to generate | ✅ Working |
| **Custom Prompt** | `customPrompt` | Custom instructions for AI content | ✅ Working |

---

## 12. ♿ Accessibility Settings (`accessibilitySettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Reduce Motion** | `reduceMotion` | Minimize animations for motion sensitivity | ✅ Working - Connected in `useReducedMotion.ts` |
| **High Contrast** | `highContrast` | Increase text/background contrast | ⚠️ UI Only - Needs CSS class implementation |
| **Large Text** | `largeText` | Force larger text size throughout app | ⚠️ UI Only - Needs font-size scaling |
| **Screen Reader Optimized** | `screenReaderOptimized` | Optimize for screen readers | ⚠️ UI Only - Needs ARIA improvements |
| **Focus Indicators** | `focusIndicators` | Show visible focus rings on keyboard navigation | ⚠️ UI Only - Needs focus-visible CSS |
| **Color Blind Mode** | `colorBlindMode` | Color filters for color blindness (protanopia, deuteranopia, tritanopia) | ⚠️ UI Only - Needs CSS filters |
| **Keyboard Shortcuts** | `keyboardShortcutsEnabled` | Enable keyboard shortcuts | ⚠️ UI Only - Needs keyboard event handlers |
| **Auto Play Media** | `autoPlayMedia` | Auto-play videos and audio | ⚠️ UI Only |

---

## 13. 🔒 Privacy Settings (`privacySettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Lock App** | `lockAppEnabled` | Require PIN/pattern to open app | ⚠️ UI Only - Needs lock screen implementation |
| **Lock Timeout** | `lockTimeout` | Minutes before auto-lock (1, 5, 15, 30) | ⚠️ UI Only |
| **Use Biometrics** | `useBiometrics` | Use fingerprint/face ID to unlock | ⚠️ UI Only - Needs Web Authn API |
| **Hide Notification Previews** | `hidePreviewsInNotifications` | Don't show content in notifications | ⚠️ UI Only - Needs notification API |
| **Hide Widget Details** | `hideDetailsInWidgets` | Show minimal info in widgets | ⚠️ UI Only |
| **Analytics Enabled** | `analyticsEnabled` | Allow usage analytics collection | ⚠️ UI Only - No analytics service connected |
| **Crash Reports** | `crashReportsEnabled` | Send crash reports to developers | ⚠️ UI Only - No error tracking service |
| **Clear Data on Logout** | `clearDataOnLogout` | Wipe local data when signing out | ⚠️ UI Only - Needs logout logic |
| **Incognito Mode** | `incognitoMode` | Temporarily disable all tracking | ⚠️ UI Only - Complex to implement |

---

## 14. 💾 Backup Settings (`backupSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Auto Backup Enabled** | `autoBackupEnabled` | Automatically backup data | ⚠️ UI Only - Needs scheduled backup job |
| **Backup Frequency** | `backupFrequency` | How often to backup (daily, weekly, monthly) | ⚠️ UI Only |
| **Backup Location** | `backupLocation` | Where to store backups (local, google_drive, both) | ⚠️ UI Only - Needs storage integration |
| **Backup Retention Days** | `backupRetentionDays` | How long to keep old backups | ⚠️ UI Only |
| **Include Attachments** | `includeAttachments` | Include files in backup | ⚠️ UI Only |
| **Encrypt Backups** | `encryptBackups` | Encrypt backup files | ⚠️ UI Only - Needs encryption logic |

---

## 15. ☁️ Sync Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Auto Sync Enabled** | `autoSyncEnabled` | Automatically sync with cloud | ✅ Working - Connected in `SettingsContext.tsx` |
| **Sync Frequency** | `syncFrequency` | How often to sync (realtime, manual) | ✅ Working |
| **Last Sync Time** | `lastSyncTime` | Timestamp of last successful sync | ✅ Working |
| **Google Drive Backup ID** | `googleDriveBackupId` | ID of backup file in Drive | ⚠️ Partially - Used for backup reference |

---

## 16. 📰 Feed Settings (`feedSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Mark as Read on Open** | `markAsReadOnOpen` | Auto-mark items read when opened | ⚠️ UI Only - Needs connection to feed items |
| **Show Read Items** | `showReadItems` | Display items that have been read | ⚠️ UI Only - Needs filter logic |
| **Feed Refresh Interval** | `feedRefreshInterval` | Auto-refresh interval in minutes (5, 15, 30, 60) | ⚠️ UI Only - Needs refresh scheduler |
| **Default Feed Sort** | `defaultFeedSort` | How to sort feed (newest, oldest, important) | ⚠️ UI Only - Needs sort logic |
| **Show Feed Previews** | `showFeedPreviews` | Show content preview in list | ⚠️ UI Only |
| **Show Read Time** | `showReadTime` | Display estimated reading time | ⚠️ UI Only |
| **Auto Summarize AI** | `autoSummarizeAI` | AI summarize feed items | ⚠️ UI Only |
| **Compact Feed View** | `compactFeedView` | Show more items per screen | ⚠️ UI Only |

---

## 17. 🔁 Habits Settings (`habitsSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Default Reminder Time** | `defaultReminderTime` | Default time for habit reminders | ⚠️ UI Only - Needs habit creation integration |
| **Show Streak Counter** | `showStreakCounter` | Display streak days on habit cards | ⚠️ UI Only - Needs habit card update |
| **Weekly Goal Days** | `weeklyGoalDays` | Target days per week to complete habits (1-7) | ⚠️ UI Only - Needs progress UI |
| **Show Habit Stats** | `showHabitStats` | Display habit statistics | ⚠️ UI Only |
| **Reset Time** | `resetTime` | What time habits reset daily | ⚠️ UI Only - Needs reset logic |
| **Habit Completion Sound** | `habitCompletionSound` | Play sound when habit completed | ⚠️ UI Only - Needs audio integration |
| **Show Missed Habits** | `showMissedHabits` | Highlight habits you missed yesterday | ⚠️ UI Only |
| **Group Habits by Time** | `groupHabitsByTime` | Group morning/evening habits | ⚠️ UI Only |

---

## 18. 🏠 Home Screen Settings (`homeSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Show Greeting** | `showGreeting` | Display personalized greeting | ⚠️ UI Only - Needs Today screen check |
| **Greeting Style** | `greetingStyle` | Greeting complexity (simple, detailed) | ⚠️ UI Only |
| **Show Daily Quote** | `showDailyQuote` | Display quote of the day | ⚠️ UI Only - May work via homeScreenLayout |
| **Show Productivity Score** | `showProductivityScore` | Display daily productivity score | ⚠️ UI Only |
| **Widget Size** | `widgetSize` | Default size for home widgets (small, medium, large) | ⚠️ UI Only |
| **Show Calendar Preview** | `showCalendarPreview` | Show upcoming events | ⚠️ UI Only |
| **Show Weather Widget** | `showWeatherWidget` | Display weather in header | ⚠️ UI Only - Needs weather API |
| **Quick Actions Enabled** | `quickActionsEnabled` | Show quick action buttons | ⚠️ UI Only |

---

## 19. ⚡ Comfort Zone Settings (`comfortZoneSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Use AI Challenges** | `useAiChallenges` | Use AI-generated challenges vs custom list | ✅ Working |
| **Custom Challenges** | `customChallenges` | Your personal list of comfort zone challenges | ✅ Working |

---

## 20. ⚙️ Visual Settings (`visualSettings`)

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Show Streaks** | `showStreaks` | Display streak counters | ⚠️ UI Only |
| **Show Legends** | `showLegends` | Show chart legends | ⚠️ UI Only |
| **Show Progress Bars** | `showProgressBars` | Show auto-dismiss progress bars | ⚠️ UI Only |
| **Compact Tooltips** | `compactTooltips` | Use smaller tooltips | ⚠️ UI Only |
| **Spinner Variant** | `spinnerVariant` | Loading spinner style (default, dots, pulse, orbit, etc.) | ⚠️ UI Only |
| **Enable Glow Effects** | `enableGlowEffects` | Glow effects on components | ⚠️ UI Only |
| **Status Message Style** | `statusMessageStyle` | Toast notification style (default, minimal, premium) | ⚠️ UI Only |
| **Enable Celebrations** | `enableCelebrations` | Confetti on success | ✅ Working - Connected in `StatusMessage.tsx` |

---

## 21. 📌 Quick Actions & Swipe

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Quick Add Enabled** | `quickAddEnabled` | Enable quick add feature | ⚠️ UI Only |
| **Default Quick Add Type** | `defaultQuickAddType` | Default item type for quick add | ⚠️ UI Only |
| **Show Confirm Dialogs** | `showConfirmDialogs` | Show confirmation before destructive actions | ⚠️ UI Only |
| **Swipe Right Action** | `swipeRightAction` | What happens on swipe right (complete, delete, postpone, none) | ⚠️ UI Only - Needs swipe handler |
| **Swipe Left Action** | `swipeLeftAction` | What happens on swipe left | ⚠️ UI Only |

---

## 22. 👥 Mentors Settings

| Setting | Key | Purpose | Status |
|---------|-----|---------|--------|
| **Enabled Mentor IDs** | `enabledMentorIds` | Which mentors are active for quotes | ✅ Working |

---

## Summary Statistics

| Category | Total Settings | ✅ Working | ⚠️ UI Only |
|----------|---------------|------------|------------|
| Profile | 2 | 2 | 0 |
| Appearance | 10 | 9 | 1 |
| Behavior | 6 | 1 | 5 |
| Interface | 8 | 7 | 1 |
| Notifications | 11 | 11 | 0 |
| Calendar | 8 | 0 | 8 |
| Tasks | 10 | 0 | 10 |
| Smart Features | 8 | 0 | 8 |
| Focus/Pomodoro | 15 | 10 | 5 |
| Workout | 17 | 14 | 3 |
| AI | 7 | 5 | 2 |
| Accessibility | 8 | 1 | 7 |
| Privacy | 9 | 0 | 9 |
| Backup | 6 | 0 | 6 |
| Sync | 4 | 3 | 1 |
| Feed | 8 | 0 | 8 |
| Habits | 8 | 0 | 8 |
| Home | 8 | 0 | 8 |
| Comfort Zone | 2 | 2 | 0 |
| Visual | 8 | 1 | 7 |
| Quick Actions | 5 | 0 | 5 |
| Mentors | 1 | 1 | 0 |
| **TOTAL** | **~159** | **~67 (42%)** | **~92 (58%)** |

---

## Priority Recommendations

### 🔴 High Priority (Core Functionality)
1. **Task Settings** - Users expect sorting and subtask progress to work
2. **Calendar Settings** - Week start day is commonly used
3. **Swipe Actions** - Expected mobile behavior

### 🟡 Medium Priority (User Value)
1. **Accessibility** - High contrast and large text are common needs
2. **Backup** - Data protection is important
3. **Privacy** - App lock is a requested feature

### 🟢 Lower Priority (Nice to Have)
1. **Smart Features** - Requires AI integration
2. **Feed Settings** - Less commonly used
3. **Visual Settings** - Cosmetic improvements
