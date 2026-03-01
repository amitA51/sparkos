import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PersonalItem, Attachment } from '../../types';
import { FileIcon } from '../icons';
import { PremiumLibraryEmptyState } from './';
import {
    listFiles as listDriveFiles,
    DriveFile,
    getFileUrl,
    isImageFile,
    isVideoFile,
    formatFileSize
} from '../../services/googleDriveService';
import { hasGoogleApiAccess } from '../../services/authService';
import { DATE_FORMATTERS } from '../../utils/formatters';

interface FileGalleryProps {
    items: PersonalItem[];
    onSelect: (item: PersonalItem) => void;
}

const FileGallery: React.FC<FileGalleryProps> = ({
    items,
    onSelect,
}) => {
    const [activeTab, setActiveTab] = useState<'local' | 'drive'>('local');
    const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
    const [isLoadingDrive, setIsLoadingDrive] = useState(false);
    const [driveError, setDriveError] = useState<string | null>(null);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>();
    const hasGoogleAccess = hasGoogleApiAccess();

    // Load Drive files
    const loadDriveFiles = useCallback(async (loadMore = false) => {
        if (!hasGoogleAccess) return;

        setIsLoadingDrive(true);
        setDriveError(null);

        try {
            const result = await listDriveFiles({
                pageSize: 30,
                pageToken: loadMore ? nextPageToken : undefined,
            });

            setDriveFiles(prev => loadMore ? [...prev, ...result.files] : result.files);
            setNextPageToken(result.nextPageToken);
        } catch (error) {
            console.error('Failed to load Drive files:', error);
            setDriveError(error instanceof Error ? error.message : 'שגיאה בטעינת קבצים');
        } finally {
            setIsLoadingDrive(false);
        }
    }, [hasGoogleAccess, nextPageToken]);

    // Load Drive files when tab changes
    React.useEffect(() => {
        if (activeTab === 'drive' && driveFiles.length === 0 && hasGoogleAccess) {
            loadDriveFiles();
        }
    }, [activeTab, driveFiles.length, hasGoogleAccess, loadDriveFiles]);

    const allFiles = useMemo(() => {
        const files: { attachment: Attachment; parentItem: PersonalItem }[] = [];
        items.forEach(item => {
            if (item.attachments) {
                item.attachments.forEach(att => {
                    files.push({ attachment: att, parentItem: item });
                });
            }
        });
        return files.sort(
            (a, b) =>
                new Date(b.parentItem.createdAt).getTime() - new Date(a.parentItem.createdAt).getTime()
        );
    }, [items]);

    const hasLocalFiles = allFiles.length > 0;

    // Empty state when no files anywhere and no Google access
    if (!hasLocalFiles && !hasGoogleAccess) {
        return (
            <PremiumLibraryEmptyState
                type="files"
                onAction={() => { }}
                actionLabel="העלה קובץ"
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Tab switcher */}
            <div className="flex gap-2 px-0 sm:px-4">
                <button
                    onClick={() => setActiveTab('local')}
                    className={`px-4 py-2 rounded-radius-button text-sm font-medium transition-all ${activeTab === 'local'
                        ? 'bg-[var(--dynamic-accent-start)] text-white'
                        : 'bg-white/5 text-theme-secondary hover:bg-white/10'
                        }`}
                >
                    קבצים מקומיים ({allFiles.length})
                </button>
                <button
                    onClick={() => setActiveTab('drive')}
                    className={`px-4 py-2 rounded-radius-button text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'drive'
                        ? 'bg-[var(--dynamic-accent-start)] text-white'
                        : 'bg-white/5 text-theme-secondary hover:bg-white/10'
                        }`}
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.71 3.5L1.15 15l4.58 6.5h13.54l4.58-6.5L17.29 3.5H7.71zm-.39 1h9.36l5.07 9H3.25l4.07-9zm4.68 10h8.58l-3.93 5.5H6.93l3.07-5.5z" />
                    </svg>
                    Google Drive {driveFiles.length > 0 && `(${driveFiles.length})`}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'local' ? (
                    <motion.div
                        key="local"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {allFiles.length === 0 ? (
                            <PremiumLibraryEmptyState
                                type="files"
                                onAction={() => { }}
                                actionLabel="העלה קובץ"
                            />
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 px-0 sm:px-4">
                                {allFiles.map((fileData, index) => {
                                    const { attachment, parentItem } = fileData;
                                    const isImage = attachment.mimeType.startsWith('image/');
                                    const isVideo = attachment.mimeType.startsWith('video/');

                                    return (
                                        <button
                                            key={`${parentItem.id}-${index}`}
                                            onClick={() => onSelect(parentItem)}
                                            className="group relative aspect-square rounded-radius-card overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] animate-in fade-in zoom-in-95"
                                            style={{
                                                background: 'var(--ql-surface-base)',
                                                border: '1px solid var(--ql-border-invisible)',
                                                animationDelay: `${Math.min(index, 12) * 30}ms`,
                                            }}
                                        >
                                            {isImage ? (
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : isVideo ? (
                                                <div className="w-full h-full bg-black flex items-center justify-center relative">
                                                    <video src={attachment.url} className="w-full h-full object-cover opacity-60" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-150 hover:scale-110">
                                                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`screen-shell h-full flex flex-col transition-all duration-300 text-center`}>
                                                    <div
                                                        className="w-14 h-14 rounded-radius-card flex items-center justify-center mb-gap-base transition-transform duration-150 hover:scale-110"
                                                        style={{
                                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                        }}
                                                    >
                                                        <FileIcon className="w-7 h-7 text-theme-secondary group-hover:text-[var(--dynamic-accent-start)] transition-colors" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-white line-clamp-2 break-all">
                                                        {attachment.name}
                                                    </span>
                                                    <span className="text-xs text-theme-muted mt-1">
                                                        {Math.round(attachment.size / 1024)} KB
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <p className="text-sm text-white font-semibold truncate">{parentItem.title}</p>
                                                <p className="text-xs text-theme-secondary truncate">{attachment.name}</p>
                                            </div>

                                            <div
                                                className="absolute inset-0 rounded-radius-card pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                style={{
                                                    boxShadow: '0 0 30px var(--dynamic-accent-glow)',
                                                }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="drive"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {!hasGoogleAccess ? (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-theme-secondary" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.71 3.5L1.15 15l4.58 6.5h13.54l4.58-6.5L17.29 3.5H7.71zm-.39 1h9.36l5.07 9H3.25l4.07-9zm4.68 10h8.58l-3.93 5.5H6.93l3.07-5.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">התחבר ל-Google Drive</h3>
                                <p className="text-theme-secondary text-sm mb-6">
                                    התחבר עם חשבון Google שלך כדי לראות את הקבצים מה-Drive
                                </p>
                                <p className="text-theme-muted text-xs">
                                    יש להתנתק ולהתחבר מחדש עם Google כדי לקבל גישה ל-Drive
                                </p>
                            </div>
                        ) : isLoadingDrive && driveFiles.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-8 h-8 border-2 border-[var(--dynamic-accent-start)] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : driveError ? (
                            <div className="text-center py-12 px-4">
                                <p className="text-red-400 mb-4">{driveError}</p>
                                <button
                                    onClick={() => loadDriveFiles()}
                                    className="px-4 py-2 bg-white/10 rounded-radius-button text-sm hover:bg-white/20 transition-colors"
                                >
                                    נסה שוב
                                </button>
                            </div>
                        ) : driveFiles.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <p className="text-theme-secondary">אין קבצים ב-Google Drive</p>
                            </div>
                        ) : (
                            <div className="space-y-4 px-0 sm:px-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {driveFiles.map((file, index) => (
                                        <a
                                            key={file.id}
                                            href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative aspect-square rounded-radius-card overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] animate-in fade-in zoom-in-95"
                                            style={{
                                                background: 'var(--ql-surface-base)',
                                                border: '1px solid var(--ql-border-invisible)',
                                                animationDelay: `${Math.min(index, 12) * 30}ms`,
                                            }}
                                        >
                                            {isImageFile(file) && file.thumbnailLink ? (
                                                <img
                                                    src={getFileUrl(file)}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : isVideoFile(file) ? (
                                                <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center p-4">
                                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                                    </div>
                                                    <span className="text-xs text-theme-secondary text-center line-clamp-2">{file.name}</span>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                                                    {file.iconLink ? (
                                                        <img src={file.iconLink} alt="" className="w-12 h-12 mb-2" loading="lazy" />
                                                    ) : (
                                                        <FileIcon className="w-12 h-12 text-theme-secondary mb-2" />
                                                    )}
                                                    <span className="text-sm font-semibold text-white line-clamp-2 break-all">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-xs text-theme-muted mt-1">
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <p className="text-sm text-white font-semibold truncate">{file.name}</p>
                                                <p className="text-xs text-theme-secondary">
                                                    {file.modifiedTime && DATE_FORMATTERS.mediumDate.format(new Date(file.modifiedTime))}
                                                </p>
                                            </div>

                                            <div
                                                className="absolute inset-0 rounded-radius-card pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                style={{
                                                    boxShadow: '0 0 30px var(--dynamic-accent-glow)',
                                                }}
                                            />
                                        </a>
                                    ))}
                                </div>

                                {nextPageToken && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={() => loadDriveFiles(true)}
                                            disabled={isLoadingDrive}
                                            className="px-6 py-2 bg-white/10 rounded-radius-button text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
                                        >
                                            {isLoadingDrive ? 'טוען...' : 'טען עוד'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileGallery;
