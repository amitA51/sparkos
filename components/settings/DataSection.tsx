import React, { useState, useRef } from 'react';
import {
  DatabaseIcon,
  DownloadIcon,
  UploadIcon,
  WarningIcon,
  KeyIcon,
  ChevronLeftIcon,
  FolderIcon,
  TrashIcon,
  ShieldIcon,
  CloudIcon,
} from '../../components/icons';
import { Screen } from '../../types';
import * as dataService from '../../services/dataService';
import { syncService } from '../../services/syncService';
import ManageSpacesModal from '../../components/ManageSpacesModal';
import ImportWizard from '../../components/ImportWizard';
import ImportModal from '../../components/import/ImportModal';
import { StatusMessageType } from '../../components/StatusMessage';
import {
  SettingsSection,
  SettingsGroupCard,
  SettingsLinkRow,
  SettingsInfoBanner,
} from './SettingsComponents';

interface DataSectionProps {
  setActiveScreen: (screen: Screen) => void;
  setStatusMessage: (msg: { type: StatusMessageType; text: string; id: number } | null) => void;
}

const DataSection: React.FC<DataSectionProps> = ({ setActiveScreen, setStatusMessage }) => {
  const [isManageSpacesOpen, setIsManageSpacesOpen] = useState(false);
  const [isImportWizardOpen, setIsImportWizardOpen] = useState(false);
  const [isTodoistImportOpen, setIsTodoistImportOpen] = useState(false);
  // 🛡️ Guard: Track when any data operation is in progress to prevent concurrent operations
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadBackupFile = (json: string) => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spark_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setStatusMessage({ type: 'success', text: 'הייצוא הושלם בהצלחה.', id: Date.now() });
  };

  const handleExport = async () => {
    try {
      const json = await dataService.exportAllData();
      downloadBackupFile(json);
    } catch (e) {
      console.error(e);
      setStatusMessage({ type: 'error', text: 'שגיאה בייצוא הנתונים.', id: Date.now() });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const json = ev.target?.result as string;
      try {
        await dataService.importAllData(json);
        window.location.reload();
      } catch (error: unknown) {
        console.error(error);
        setStatusMessage({
          type: 'error',
          text: 'קובץ לא תקין או שגיאה בייבוא.',
          id: Date.now(),
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleWipeData = async () => {
    if (confirm('האם אתה בטוח? פעולה זו תמחק את כל הנתונים וההגדרות לצמיתות.')) {
      await dataService.wipeAllData();
      window.location.reload();
    }
  };

  return (
    <SettingsSection title="ניהול נתונים" id="data">
      {/* Organization */}
      <SettingsGroupCard title="ארגון" icon={<FolderIcon className="w-5 h-5" />}>
        <SettingsLinkRow
          title="ניהול מרחבים ופידים"
          description="נהל את מרחבי התוכן האישיים שלך"
          icon={<FolderIcon className="w-5 h-5" />}
          onClick={() => setIsManageSpacesOpen(true)}
        />
      </SettingsGroupCard>

      {/* Security */}
      <SettingsGroupCard title="אבטחה ופרטיות" icon={<ShieldIcon className="w-5 h-5" />}>
        <SettingsLinkRow
          title="מנהל סיסמאות"
          description="נהל את הסיסמאות שלך בצורה מאובטחת"
          icon={<KeyIcon className="w-5 h-5" />}
          onClick={() => setActiveScreen('passwords')}
          badge="מאובטח"
          badgeColor="success"
        />
      </SettingsGroupCard>

      {/* Backup & Sync */}
      <SettingsGroupCard title="גיבוי ושחזור" icon={<DatabaseIcon className="w-5 h-5" />}>
        <div className="space-y-3">
          {/* Restore from Google Drive */}
          <button
            disabled={isProcessing}
            onClick={async () => {
              if (isProcessing) return; // 🛡️ Double guard
              if (confirm('האם לשחזר נתונים מ-Google Drive? פעולה זו תחליף את הנתונים הנוכחיים.')) {
                setIsProcessing(true);
                try {
                  setStatusMessage({ type: 'info', text: 'משחזר נתונים...', id: Date.now() });
                  await syncService.restoreFromBackup();
                  setStatusMessage({ type: 'success', text: 'השחזור הושלם בהצלחה! מרענן...', id: Date.now() });
                  setTimeout(() => window.location.reload(), 1500);
                } catch (error) {
                  console.error(error);
                  // 🛡️ Improved error messages
                  let msg = 'שגיאה בשחזור מ-Drive';
                  if (error instanceof Error) {
                    if (error.message.includes('network') || error.message.includes('Network')) {
                      msg = 'שגיאת רשת - בדוק את החיבור לאינטרנט';
                    } else if (error.message.includes('auth') || error.message.includes('Auth')) {
                      msg = 'נדרש להתחבר מחדש ל-Google';
                    } else {
                      msg = error.message;
                    }
                  }
                  setStatusMessage({ type: 'error', text: msg, id: Date.now() });
                } finally {
                  setIsProcessing(false);
                }
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-xl bg-[var(--dynamic-accent-start)]/10 hover:bg-[var(--dynamic-accent-start)]/20 border border-[var(--dynamic-accent-start)]/20 hover:border-[var(--dynamic-accent-start)]/40 transition-all group mb-4 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--dynamic-accent-start)] text-white shadow-lg shadow-[var(--dynamic-accent-start)]/30">
                <CloudIcon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-white font-medium block">שחזור מ-Google Drive</span>
                <span className="text-xs text-[var(--text-secondary)]">שחזר נתונים מגיבוי ענן ישן</span>
              </div>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-[var(--dynamic-accent-start)]" />
          </button>
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[var(--dynamic-accent-start)]/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--dynamic-accent-start)]/10 text-[var(--dynamic-accent-start)] group-hover:bg-[var(--dynamic-accent-start)]/20 transition-colors">
                <DownloadIcon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-white font-medium block">ייצוא נתונים</span>
                <span className="text-xs text-[var(--text-secondary)]">שמור קובץ גיבוי של כל הנתונים</span>
              </div>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
          </button>

          {/* Import Button */}
          <label className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[var(--dynamic-accent-start)]/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--dynamic-accent-start)]/10 text-[var(--dynamic-accent-start)] group-hover:bg-[var(--dynamic-accent-start)]/20 transition-colors">
                <UploadIcon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-white font-medium block">ייבוא נתונים</span>
                <span className="text-xs text-[var(--text-secondary)]">שחזר נתונים מקובץ גיבוי</span>
              </div>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]" />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              ref={fileInputRef}
            />
          </label>

          {/* Advanced Import */}
          <button
            onClick={() => setIsImportWizardOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[var(--dynamic-accent-start)]/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                <UploadIcon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-white font-medium block">ייבוא מתקדם</span>
                <span className="text-xs text-[var(--text-secondary)]">Notion, Obsidian, Todoist ועוד</span>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
              מתקדם
            </span>
          </button>

          {/* Todoist Import */}
          <button
            onClick={() => setIsTodoistImportOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-green-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
                <span className="text-lg">✅</span>
              </div>
              <div className="text-right">
                <span className="text-white font-medium block">ייבוא מ-Todoist</span>
                <span className="text-xs text-[var(--text-secondary)]">סנכרן משימות מ-Todoist</span>
              </div>
            </div>
            <ChevronLeftIcon className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-green-400" />
          </button>
        </div>
      </SettingsGroupCard>

      {/* Danger Zone */}
      <SettingsGroupCard title="אזור מסוכן" danger icon={<WarningIcon className="w-5 h-5" />}>
        <SettingsInfoBanner variant="warning">
          פעולות באזור זה הן בלתי הפיכות. וודא שיש לך גיבוי לפני שתמשיך.
        </SettingsInfoBanner>

        <button
          onClick={handleWipeData}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all group mt-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 group-hover:bg-red-500/30 transition-colors">
              <TrashIcon className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-red-400 font-medium block">מחק את כל הנתונים</span>
              <span className="text-xs text-red-400/70">פעולה זו לא ניתנת לביטול</span>
            </div>
          </div>
          <ChevronLeftIcon className="w-5 h-5 text-red-400/50" />
        </button>
      </SettingsGroupCard>

      {isManageSpacesOpen && <ManageSpacesModal isOpen={true} onClose={() => setIsManageSpacesOpen(false)} />}
      {isImportWizardOpen && (
        <ImportWizard
          isOpen={isImportWizardOpen}
          onClose={() => setIsImportWizardOpen(false)}
          onImport={async items => {
            for (const item of items) {
              await dataService.addPersonalItem(item);
            }
            setStatusMessage({
              type: 'success',
              text: `${items.length} פריטים יובאו בהצלחה!`,
              id: Date.now(),
            });
          }}
        />
      )}
      <ImportModal
        isOpen={isTodoistImportOpen}
        onClose={() => setIsTodoistImportOpen(false)}
      />
    </SettingsSection>
  );
};

export default DataSection;

