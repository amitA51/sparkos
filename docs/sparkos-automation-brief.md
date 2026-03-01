# 🤖 SparkOS n8n Automation - Brief מלא לסוכן AI

## 🎯 מטרת המערכת
SparkOS היא אפליקציית Productivity מבוססת React + Firebase עם ממשק דו-כיווני עם Telegram באמצעות n8n.

---

## 📦 סוגי Items נתמכים (`PersonalItemType`)

```typescript
PERSONAL_ITEM_TYPES = [
  'task',      // משימה - עם dueDate, priority, subTasks
  'habit',     // הרגל - עם streak, completionHistory
  'antigoal',  // הרגל רע להפסיק - עם triggers, slipHistory
  'workout',   // אימון - עם exercises, sets
  'note',      // הערה
  'link',      // קישור שמור - עם url, domain
  'learning',  // חומר לימוד
  'goal',      // מטרה
  'journal',   // יומן
  'book',      // ספר - עם author, currentPage
  'idea',      // רעיון
  'gratitude', // הכרת תודה
  'roadmap',   // מפת דרכים - עם phases, tasks
]
```

---

## 📐 סכימת PersonalItem - שדות חובה

```typescript
interface PersonalItem {
  // ⚠️ חובה
  id: string;          // Format: "p-{timestamp}"
  type: PersonalItemType;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601

  // שדות בסיסיים
  title?: string;
  content?: string;
  tags?: string[];
  spaceId?: string;
  icon?: string;
  order?: number;

  // משימות (task)
  isCompleted?: boolean;
  isImportant?: boolean;
  isPinned?: boolean;
  dueDate?: string;    // "YYYY-MM-DD"
  dueTime?: string;    // "HH:mm"
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'doing' | 'done';
  subTasks?: SubTask[];

  // הרגלים (habit)
  habitType?: 'good' | 'bad';
  streak?: number;
  lastCompleted?: string;
  frequency?: 'daily' | 'weekly' | 'custom';
  reminderEnabled?: boolean;
  reminderTime?: string;
}
```

---

## 📐 סכימת SubTask - חובה להיות אובייקט!

```typescript
interface SubTask {
  id: string;           // Format: "st-{timestamp}-{index}"
  title: string;
  isCompleted: boolean;
}
```

> ⚠️ **קריטי:** `subTasks` חייב להיות מערך של **אובייקטים**, לא מחרוזות!

---

## 🔥 Firebase Structure

```
users/
  {userId}/
    personalItems/     ← כל ה-Items נשמרים כאן
      {itemId}/
    data/
      config           ← הגדרות משתמש
    eventLog/          ← לוג אירועים (שיחות)
```

**Firestore Columns (לשמירה):**
```
title,content,type,priority,createdAt,updatedAt,source,isCompleted,subTasks,dueDate,dueTime,tags,status,spaceId,isImportant,isPinned
```

---

## 🔄 Webhook Service (קיים באפליקציה)

האפליקציה שולחת webhooks ל-n8n:
- `onItemCreated` - כשנוצר item
- `onItemDeleted` - כשנמחק item
- `onTaskCompleted` - כשמשימה הושלמה
- `onHabitCompleted` - כשהרגל הושלם

---

## ✅ דרישות מהאוטומציה

### 1. **יצירת Items (INSERT)**
- תמיכה בכל 12 סוגי items
- `subTasks` כמערך אובייקטים
- `updatedAt` חובה
- `source: 'sparkos'` לזיהוי מקור

### 2. **חיפוש Items (SEARCH)**
- חיפוש לפי type, tags, priority
- החזרת תוצאות מפורמטות בעברית

### 3. **עדכון Items (UPDATE)**
- עדכון `isCompleted`, `status`, `priority`
- עדכון `updatedAt` בכל שינוי

### 4. **Calendar Integration**
- יצירת אירועים ב-Google Calendar
- חישוב תאריכים יחסיים (מחר, בעוד שבוע)

### 5. **זיכרון שיחה**
- Pinecone namespace: `user-{telegramUserId}`
- שמירת context לשיחות המשך

---

## 🚀 שיפורים מומלצים

### A. תמיכה בסוגים נוספים
הAgent צריך לזהות ולטפל ב:
- `workout` - אימונים עם exercises
- `habit` - הרגלים עם streak
- `roadmap` - פרויקטים עם phases
- `book` - ספרים עם currentPage

### B. Webhook קבלה
להוסיף trigger שמקבל webhooks מהאפליקציה:
- כשמשתמש משלים משימה באפליקציה → שליחת הודעה לטלגרם

### C. סנכרון דו-כיווני
- שינוי באפליקציה → עדכון לטלגרם
- שינוי בטלגרם → עדכון באפליקציה

### D. Smart Reminders
- תזכורות אוטומטיות לפי dueDate/dueTime
- התראות streak להרגלים

---

## 📝 Type Mapping (מה AI אומר → מה נשמר)

| AI Output | SparkOS Type |
|-----------|--------------|
| fitness   | workout      |
| project   | roadmap      |
| event     | task         |
| reminder  | task         |
| todo      | task         |

---

## 🔐 Credentials נדרשים

- `Google Service Account` - Firebase
- `Telegram Bot API`
- `Pinecone API`
- `Google Gemini API`
- `Google Calendar` (OAuth)

---

## 📌 דוגמאות בקשות ותוצאות

**בקשה:** "תזכיר לי מחר ב-14:00 להתקשר לאמא"
```json
{
  "type": "task",
  "title": "📞 להתקשר לאמא",
  "dueDate": "2024-12-30",
  "dueTime": "14:00",
  "priority": "medium",
  "status": "todo"
}
```

**בקשה:** "רעיון: אפליקציה לניהול זמן"
```json
{
  "type": "idea",
  "title": "💡 אפליקציה לניהול זמן",
  "content": "אפליקציה לניהול זמן"
}
```

**בקשה:** "משימה עם תתי משימות: לנקות הבית - סלון, חדר שינה, מטבח"
```json
{
  "type": "task",
  "title": "🧹 לנקות הבית",
  "subTasks": [
    {"id": "st-1234-0", "title": "סלון", "isCompleted": false},
    {"id": "st-1234-1", "title": "חדר שינה", "isCompleted": false},
    {"id": "st-1234-2", "title": "מטבח", "isCompleted": false}
  ]
}
```
