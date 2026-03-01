import { exportAllData, importAllData } from './dataService';
import { uploadBackup, findBackupFile, downloadBackup } from './googleDriveService';
import { auth } from '../config/firebase';

class SyncService {
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private isAutoSavePending = false;
  private readonly AUTO_SAVE_DELAY = 5000; // 5 seconds debounce
  private backupFileId: string | null = null;
  private unsubscribeAuth: (() => void) | null = null; // ✅ PERF: Store for cleanup

  init() {
    // Setup listeners if needed, or just ensure auth state
    if (!auth) return;
    this.unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Wait for token to be available (it might take a moment after login)
        // We simply retry finding the backup file safely
        setTimeout(async () => {
          try {
            // Check if we have a token before trying to find backup
            // This prevents the "No access token" error on initial load if user hasn't granted permissions yet
            // or if the token save is slightly delayed.
            const hasToken = localStorage.getItem('google_access_token');
            if (hasToken) {
              this.backupFileId = await findBackupFile();
            } else {
              console.log('SyncService: No Google token found, skipping initial backup search.');
            }
          } catch (error) {
            // Silent fail is okay here, user might not have connected Google Drive
            console.warn('SyncService: Failed to find initial backup file (Google Drive might not be connected)', error);
          }
        }, 2000); // 2 second delay to allow token to be stored
      } else {
        this.backupFileId = null;
      }
    });
  }

  triggerAutoSave() {
    if (this.isAutoSavePending) return;

    this.isAutoSavePending = true;

    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(async () => {
      await this.performAutoSave();
      this.isAutoSavePending = false;
    }, this.AUTO_SAVE_DELAY);
  }

  private async performAutoSave() {
    const user = auth?.currentUser;
    if (!user) {

      return;
    }

    try {

      // Export data without password for cloud backup (assuming user's drive is secure)
      // Or we could implement a user setting for backup password later.
      const data = await exportAllData();

      // Refresh file ID if we don't have it (might have been created since init)
      if (!this.backupFileId) {
        this.backupFileId = await findBackupFile();
      }

      const newFileId = await uploadBackup(data, this.backupFileId || undefined);

      // Update our cache if it was a new file
      if (newFileId) {
        this.backupFileId = newFileId;
      }


    } catch (error) {
      console.error('SyncService: Auto-save failed:', error);
    }
  }

  /**
   * Restore data manually from Google Drive
   */
  async restoreFromBackup(): Promise<boolean> {
    try {

      const backupId = this.backupFileId || await findBackupFile();

      if (!backupId) {
        throw new Error('לא נמצא קובץ גיבוי ב-Google Drive.');
      }

      const backupData = await downloadBackup(backupId);

      if (!backupData) {
        throw new Error('קובץ הגיבוי ריק.');
      }

      // Convert to string for importAllData if it's already an object
      const jsonString = typeof backupData === 'string' ? backupData : JSON.stringify(backupData);

      await importAllData(jsonString);

      return true;
    } catch (error) {
      console.error('SyncService: Restore failed:', error);
      throw error;
    }
  }

  /**
   * ✅ PERF: Cleanup to prevent memory leaks
   * Call on logout or app unmount
   */
  cleanup() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
    this.isAutoSavePending = false;
    this.backupFileId = null;
  }
}

export const syncService = new SyncService();
