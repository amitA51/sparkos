import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, CheckCircleIcon, ArrowRightIcon } from '../icons';
import {
    fetchTodoistTasks,
    fetchTodoistProjects,
    mapTodoistToPersonalItem,
    verifyTodoistToken,
    TodoistTask,
    TodoistProject
} from '../../services/import/todoistService';
import {
    verifyNotionToken,
    fetchNotionDatabases,
    importFromNotionDatabase,
    getDatabaseTitle,
    getDatabaseIcon,
} from '../../services/import/notionService';
import { useData } from '../../src/contexts/DataContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { PersonalItem } from '../../types';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ImportSource = 'todoist' | 'notion' | null;
type ImportStep = 'select' | 'auth' | 'database' | 'preview' | 'importing' | 'complete';

interface NotionDatabase {
    object: 'database';
    id: string;
    title: Array<{ text: { content: string } }>;
    icon?: { emoji?: string };
}

/**
 * ImportModal - Modal for importing tasks from external sources
 * Supports Todoist and Notion
 */
export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
    const [source, setSource] = useState<ImportSource>(null);
    const [step, setStep] = useState<ImportStep>('select');
    const [apiToken, setApiToken] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Todoist-specific state
    const [todoistTasks, setTodoistTasks] = useState<TodoistTask[]>([]);
    const [todoistProjects, setTodoistProjects] = useState<TodoistProject[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

    // Notion-specific state
    const [notionDatabases, setNotionDatabases] = useState<NotionDatabase[]>([]);
    const [notionItems, setNotionItems] = useState<PersonalItem[]>([]);
    const [selectedNotionItems, setSelectedNotionItems] = useState<Set<string>>(new Set());

    const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);

    const { addPersonalItem } = useData();
    const { triggerHaptic, hapticSuccess } = useHaptics();

    // Reset state
    const reset = useCallback(() => {
        setSource(null);
        setStep('select');
        setApiToken('');
        setError(null);
        setTodoistTasks([]);
        setTodoistProjects([]);
        setSelectedTasks(new Set());
        setNotionDatabases([]);
        setNotionItems([]);
        setSelectedNotionItems(new Set());
        setImportResult(null);
    }, []);

    // Handle source selection
    const handleSelectSource = (newSource: ImportSource) => {
        triggerHaptic('light');
        setSource(newSource);
        setStep('auth');
    };

    // Handle token verification
    const handleVerifyToken = async () => {
        if (!apiToken.trim()) {
            setError('יש להזין API Token');
            return;
        }

        setIsLoading(true);
        setError(null);
        triggerHaptic('medium');

        try {
            if (source === 'todoist') {
                const isValid = await verifyTodoistToken(apiToken);
                if (!isValid) {
                    setError('Token לא תקין. בדוק את הפרטים ונסה שוב.');
                    return;
                }

                const [tasks, projects] = await Promise.all([
                    fetchTodoistTasks(apiToken),
                    fetchTodoistProjects(apiToken),
                ]);

                setTodoistTasks(tasks.filter(t => !t.is_completed));
                setTodoistProjects(projects);
                setSelectedTasks(new Set(tasks.filter(t => !t.is_completed).map(t => t.id)));
                setStep('preview');
            } else if (source === 'notion') {
                const verification = await verifyNotionToken(apiToken);
                if (!verification.valid) {
                    setError(verification.error || 'Token לא תקין');
                    return;
                }

                const databases = await fetchNotionDatabases(apiToken);
                if (databases.length === 0) {
                    setError('לא נמצאו databases. וודא שהאינטגרציה משותפת עם ה-databases שלך.');
                    return;
                }

                setNotionDatabases(databases as NotionDatabase[]);
                setStep('database');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'שגיאה בהתחברות');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Notion database selection
    const handleSelectDatabase = async (databaseId: string) => {
        setIsLoading(true);
        triggerHaptic('medium');

        try {
            const items = await importFromNotionDatabase(apiToken, databaseId);
            setNotionItems(items);
            setSelectedNotionItems(new Set(items.map(i => i.id)));
            setStep('preview');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'שגיאה בטעינת הפריטים');
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle task selection (Todoist)
    const toggleTask = (taskId: string) => {
        triggerHaptic('light');
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(taskId)) {
            newSelected.delete(taskId);
        } else {
            newSelected.add(taskId);
        }
        setSelectedTasks(newSelected);
    };

    // Toggle item selection (Notion)
    const toggleNotionItem = (itemId: string) => {
        triggerHaptic('light');
        const newSelected = new Set(selectedNotionItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedNotionItems(newSelected);
    };

    // Select/deselect all
    const toggleAll = () => {
        triggerHaptic('light');
        if (source === 'todoist') {
            if (selectedTasks.size === todoistTasks.length) {
                setSelectedTasks(new Set());
            } else {
                setSelectedTasks(new Set(todoistTasks.map(t => t.id)));
            }
        } else if (source === 'notion') {
            if (selectedNotionItems.size === notionItems.length) {
                setSelectedNotionItems(new Set());
            } else {
                setSelectedNotionItems(new Set(notionItems.map(i => i.id)));
            }
        }
    };

    // Get project name by ID
    const getProjectName = (projectId: string): string => {
        return todoistProjects.find(p => p.id === projectId)?.name || '';
    };

    // Get selected count
    const getSelectedCount = () => {
        return source === 'todoist' ? selectedTasks.size : selectedNotionItems.size;
    };

    // Handle import
    const handleImport = async () => {
        setStep('importing');
        setIsLoading(true);
        triggerHaptic('medium');

        let imported = 0;
        let skipped = 0;

        try {
            if (source === 'todoist') {
                for (const task of todoistTasks) {
                    if (!selectedTasks.has(task.id)) {
                        skipped++;
                        continue;
                    }
                    const personalItem = mapTodoistToPersonalItem(task, getProjectName(task.project_id));
                    await addPersonalItem(personalItem);
                    imported++;
                }
            } else if (source === 'notion') {
                for (const item of notionItems) {
                    if (!selectedNotionItems.has(item.id)) {
                        skipped++;
                        continue;
                    }
                    await addPersonalItem(item);
                    imported++;
                }
            }

            setImportResult({ imported, skipped });
            setStep('complete');
            hapticSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'שגיאה בייבוא');
            setStep('preview');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#1C1C1E] rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">
                        {step === 'select' && 'ייבוא משימות'}
                        {step === 'auth' && `התחברות ל-${source === 'todoist' ? 'Todoist' : 'Notion'}`}
                        {step === 'database' && 'בחירת Database'}
                        {step === 'preview' && 'בחירת פריטים'}
                        {step === 'importing' && 'מייבא...'}
                        {step === 'complete' && 'הייבוא הושלם!'}
                    </h2>
                    <button
                        onClick={() => { reset(); onClose(); }}
                        className="p-2 text-theme-secondary hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Select Source */}
                        {step === 'select' && (
                            <motion.div
                                key="select"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <p className="text-theme-secondary text-sm mb-6">
                                    בחר מקור לייבוא המשימות שלך:
                                </p>

                                <button
                                    onClick={() => handleSelectSource('todoist')}
                                    className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-4 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#E44332]/20 flex items-center justify-center">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h3 className="font-semibold text-white">Todoist</h3>
                                        <p className="text-sm text-theme-muted">ייבא משימות מחשבון ה-Todoist שלך</p>
                                    </div>
                                    <ArrowRightIcon className="w-5 h-5 text-theme-muted group-hover:text-white rotate-180" />
                                </button>

                                <button
                                    onClick={() => handleSelectSource('notion')}
                                    className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-4 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h3 className="font-semibold text-white">Notion</h3>
                                        <p className="text-sm text-theme-muted">ייבא פריטים מ-Databases ב-Notion</p>
                                    </div>
                                    <ArrowRightIcon className="w-5 h-5 text-theme-muted group-hover:text-white rotate-180" />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Authentication */}
                        {step === 'auth' && (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className={`p-4 rounded-xl border ${source === 'todoist' ? 'bg-[#E44332]/10 border-[#E44332]/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                                    <p className="text-sm text-blue-300 leading-relaxed">
                                        {source === 'todoist' ? (
                                            <>
                                                כדי לייבא משימות, צריך API Token מ-Todoist.<br />
                                                נמצא: Settings → Integrations → Developer → API Token
                                            </>
                                        ) : (
                                            <>
                                                צור Internal Integration ב-Notion:<br />
                                                1. לך ל-notion.so/my-integrations<br />
                                                2. צור אינטגרציה חדשה והעתק את ה-Token<br />
                                                3. שתף את ה-Databases עם האינטגרציה
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-theme-secondary mb-2">Integration Token</label>
                                    <input
                                        type="password"
                                        value={apiToken}
                                        onChange={e => setApiToken(e.target.value)}
                                        placeholder="הדבק את ה-Token כאן..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
                                        {error}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2.5: Database Selection (Notion only) */}
                        {step === 'database' && source === 'notion' && (
                            <motion.div
                                key="database"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-theme-secondary mb-4">בחר Database לייבוא:</p>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {notionDatabases.map(db => (
                                        <button
                                            key={db.id}
                                            onClick={() => handleSelectDatabase(db.id)}
                                            disabled={isLoading}
                                            className="w-full p-4 rounded-xl text-right flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                                                {getDatabaseIcon(db as any)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{getDatabaseTitle(db as any)}</p>
                                            </div>
                                            <ArrowRightIcon className="w-5 h-5 text-theme-muted rotate-180" />
                                        </button>
                                    ))}
                                </div>

                                {isLoading && (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                                    </div>
                                )}

                                {error && (
                                    <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
                                        {error}
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Preview Tasks */}
                        {step === 'preview' && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-theme-secondary">
                                        נמצאו {source === 'todoist' ? todoistTasks.length : notionItems.length} פריטים
                                    </p>
                                    <button onClick={toggleAll} className="text-sm text-violet-400 hover:text-violet-300">
                                        {(source === 'todoist' ? selectedTasks.size === todoistTasks.length : selectedNotionItems.size === notionItems.length) ? 'בטל הכל' : 'בחר הכל'}
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {source === 'todoist' ? (
                                        todoistTasks.map(task => (
                                            <button
                                                key={task.id}
                                                onClick={() => toggleTask(task.id)}
                                                className={`w-full p-3 rounded-xl text-right flex items-center gap-3 transition-all ${selectedTasks.has(task.id) ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedTasks.has(task.id) ? 'bg-violet-500 border-violet-500' : 'border-white/30'}`}>
                                                    {selectedTasks.has(task.id) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white truncate">{task.content}</p>
                                                    <p className="text-xs text-theme-muted">{getProjectName(task.project_id)}{task.due && ` • ${task.due.string}`}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        notionItems.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleNotionItem(item.id)}
                                                className={`w-full p-3 rounded-xl text-right flex items-center gap-3 transition-all ${selectedNotionItems.has(item.id) ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedNotionItems.has(item.id) ? 'bg-violet-500 border-violet-500' : 'border-white/30'}`}>
                                                    {selectedNotionItems.has(item.id) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white truncate">{item.title}</p>
                                                    <p className="text-xs text-theme-muted">{item.type}{item.dueDate && ` • ${item.dueDate}`}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Importing */}
                        {step === 'importing' && (
                            <motion.div
                                key="importing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-12"
                            >
                                <div className="w-16 h-16 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin mb-4" />
                                <p className="text-white">מייבא {getSelectedCount()} פריטים...</p>
                            </motion.div>
                        )}

                        {/* Step 5: Complete */}
                        {step === 'complete' && importResult && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                    <CheckCircleIcon className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">הייבוא הושלם!</h3>
                                <p className="text-theme-secondary">
                                    <span className="text-green-400 font-semibold">{importResult.imported}</span> פריטים יובאו
                                    {importResult.skipped > 0 && (
                                        <span className="text-theme-muted"> • {importResult.skipped} דולגו</span>
                                    )}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex gap-3">
                    {step === 'auth' && (
                        <>
                            <button
                                onClick={() => setStep('select')}
                                className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                            >
                                חזור
                            </button>
                            <button
                                onClick={handleVerifyToken}
                                disabled={isLoading || !apiToken.trim()}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium disabled:opacity-50 transition-all"
                            >
                                {isLoading ? 'מתחבר...' : 'התחבר'}
                            </button>
                        </>
                    )}

                    {step === 'database' && (
                        <button
                            onClick={() => setStep('auth')}
                            className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                        >
                            חזור
                        </button>
                    )}

                    {step === 'preview' && (
                        <>
                            <button
                                onClick={() => setStep(source === 'notion' ? 'database' : 'auth')}
                                className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                            >
                                חזור
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={getSelectedCount() === 0}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium disabled:opacity-50 transition-all"
                            >
                                ייבא {getSelectedCount()} פריטים
                            </button>
                        </>
                    )}

                    {step === 'complete' && (
                        <button
                            onClick={() => { reset(); onClose(); }}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium transition-all"
                        >
                            סיום
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImportModal;
