import React from 'react';
import { PremiumEmptyState } from '../common/PremiumEmptyState';

// Keep this type in sync with all supported empty state views in the library
interface PremiumLibraryEmptyStateProps {
  type:
  | 'projects'
  | 'spaces'
  | 'inbox'
  | 'timeline'
  | 'files'
  | 'general'
  | 'favorites'
  | 'recent';
  onAction?: () => void;
  actionLabel?: string;
}

// Central config for all library empty states
const emptyStateConfigs: Record<PremiumLibraryEmptyStateProps['type'], {
  title: string;
  description: string;
  illustration: string;
  color: string;
  suggestions: string[];
}> = {
  projects: {
    title: 'המסע מתחיל כאן',
    description: 'מפת דרכים מחלקת מטרות גדולות לשלבים ברורים. צור את הראשונה.',
    illustration: '◇',
    color: 'var(--dynamic-accent-start)',
    suggestions: ['קריירה', 'לימודים', 'פרויקט אישי'],
  },
  spaces: {
    title: 'ארגן לפי נושאים',
    description: 'מרחבים מאפשרים לארגן פריטים לפי נושא או פרויקט.',
    illustration: '○',
    color: '#8B5CF6',
    suggestions: ['עבודה', 'אישי', 'בריאות'],
  },
  inbox: {
    title: 'הכל מסודר',
    description: 'פריטים חדשים יופיעו כאן לפני שתארגן אותם.',
    illustration: '□',
    color: '#10B981',
    suggestions: ['משימה', 'הערה', 'רעיון'],
  },
  timeline: {
    title: 'התמונה הגדולה',
    description: 'הוסף תאריכי יעד כדי לראות את הפריטים שלך לאורך הזמן.',
    illustration: '―',
    color: '#F59E0B',
    suggestions: ['תאריך יעד', 'משימה חדשה'],
  },
  files: {
    title: 'אין קבצים',
    description: 'העלה קבצים או צרף אותם לפריטים קיימים.',
    illustration: '◈',
    color: '#EC4899',
    suggestions: ['העלה קובץ', 'צור מסמך'],
  },
  favorites: {
    title: 'גישה מהירה',
    description: 'סמן פריטים חשובים כמועדפים לגישה מהירה מכל מקום.',
    illustration: '☆',
    color: '#FACC15',
    suggestions: ['משימה חשובה', 'פרויקט מועדף', 'רעיון מרכזי'],
  },
  recent: {
    title: 'פעילות אחרונה',
    description: 'כשתתחיל לעבוד, הפריטים האחרונים יופיעו כאן.',
    illustration: '◷',
    color: '#38BDF8',
    suggestions: ['פרויקט קיים', 'משימה חדשה', 'הערה מהירה'],
  },
  general: {
    title: 'המקום ריק',
    description: 'הזמן ליצור משהו חדש.',
    illustration: '◊',
    color: 'var(--dynamic-accent-start)',
    suggestions: ['פריט חדש'],
  },
};

const PremiumLibraryEmptyState: React.FC<PremiumLibraryEmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
}) => {
  const config = emptyStateConfigs[type];

  return (
    <PremiumEmptyState
      title={config.title}
      description={config.description}
      illustration={config.illustration}
      color={config.color}
      suggestions={config.suggestions}
      onAction={onAction}
      actionLabel={actionLabel}
    />
  );
};

export default PremiumLibraryEmptyState;