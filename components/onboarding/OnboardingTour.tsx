import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, CheckCircleIcon, XIcon, ArrowRightIcon, ArrowLeftIcon } from '../icons';
import { createPortal } from 'react-dom';
import type { Screen } from '../../types';

interface TourStep {
    targetId: string;
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    targetScreen?: Screen; // Screen to navigate to for this step
}

// Define the comprehensive tour steps
const TOUR_STEPS: TourStep[] = [
    {
        targetId: 'welcome-step', // Virtual step
        title: 'ברוכים הבאים ל-Spark OS! ✨',
        description: 'הפלטפורמה שלך לניהול חיים, מטרות והרגלים. בוא נעשה סיבוב קצר כדי להכיר את המערכת.',
        position: 'center',
        targetScreen: 'today',
    },
    {
        targetId: 'nav-today',
        title: 'היום שלי',
        description: 'כאן מתחיל היום שלך. המשימות, ההרגלים והפוקוס היומי שלך נמצאים כאן בריכוז אחד.',
        position: 'top',
        targetScreen: 'today',
    },
    {
        targetId: 'nav-feed',
        title: 'הפיד היומי',
        description: 'עדכונים, תזכורות ומידע רלוונטי שמתעדכן בזמן אמת כדי לשמור אותך בעניינים.',
        position: 'top',
        targetScreen: 'feed',
    },
    {
        targetId: 'nav-library',
        title: 'הספרייה שלך',
        description: 'המוח השני שלך. פרויקטים, מחברות, משאבים וכל מה שחשוב לשמור ולחפש.',
        position: 'top',
        targetScreen: 'library',
    },
    {
        targetId: 'nav-search',
        title: 'חיפוש מתקדם',
        description: 'מצא כל דבר במערכת במהירות הברק.',
        position: 'top',
        targetScreen: 'search',
    },
    {
        targetId: 'nav-add',
        title: 'הוספה מהירה',
        description: 'לחיצה אחת כדי להוסיף משימה, פתק או רעיון. לחיצה ארוכה לפתק מהיר.',
        position: 'top',
        targetScreen: 'today', // Return to home or stay on current
    },
    // Optional: Settings step could be added if we had a visible settings button
    // {
    //     targetId: 'nav-settings',
    //     title: 'הגדרות',
    //     description: 'התאם את המערכת לצרכים שלך.',
    //     position: 'top',
    //     targetScreen: 'settings'
    // }
];

interface OnboardingTourProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
    isAuthenticated: boolean;
    isGuest: boolean;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({
    activeScreen,
    setActiveScreen,
    isAuthenticated,
    isGuest
}) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial check for tour eligibility
    useEffect(() => {
        // Only run if user is authenticated or in guest mode
        if (!isAuthenticated && !isGuest) return;

        // Check if user has seen tour
        const hasSeenTour = localStorage.getItem('spark_onboarding_completed');

        // Don't show on login/signup screens just in case
        if (activeScreen === 'login' || activeScreen === 'signup') return;

        if (!hasSeenTour) {
            // Wait a bit for app to load/animations to finish
            const timer = setTimeout(() => {
                setIsVisible(true);
                setCurrentStepIndex(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [isAuthenticated, isGuest, activeScreen]);

    // Handle step changes and navigation
    useEffect(() => {
        if (currentStepIndex >= 0 && currentStepIndex < TOUR_STEPS.length) {
            const step = TOUR_STEPS[currentStepIndex];
            if (!step) return;

            // Handle navigation if needed
            if (step.targetScreen && step.targetScreen !== activeScreen) {
                setActiveScreen(step.targetScreen);
                // Give a small delay for the screen to render before finding the element
                setTimeout(() => updateTargetRect(step), 300);
            } else {
                updateTargetRect(step);
            }
        }
    }, [currentStepIndex, activeScreen, setActiveScreen]);

    const updateTargetRect = (step: TourStep) => {
        if (step.position === 'center') {
            setTargetRect(null);
            return;
        }

        const el = document.getElementById(step.targetId);
        if (el) {
            setTargetRect(el.getBoundingClientRect());
            // Scroll into view if needed (mostly for mobile/vertical layouts)
            // el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.warn(`Tour target ${step.targetId} not found.`);
            // Fallback to center if target not found
            setTargetRect(null);
        }
    };

    // Update rect on resize
    useEffect(() => {
        const handleResize = () => {
            if (currentStepIndex >= 0 && TOUR_STEPS[currentStepIndex]) {
                updateTargetRect(TOUR_STEPS[currentStepIndex]);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentStepIndex]);

    const handleNext = () => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('spark_onboarding_completed', 'true');
        // Reset to home after tour 
        setActiveScreen('today');
    };

    const handleSkip = () => {
        setIsVisible(false);
        localStorage.setItem('spark_onboarding_completed', 'true');
    };

    if (!isVisible || currentStepIndex < 0 || currentStepIndex >= TOUR_STEPS.length) return null;

    const currentStep = TOUR_STEPS[currentStepIndex];

    return createPortal(
        <div className="fixed inset-0 z-[100] pointer-events-none font-sans">
            {/* Backdrop / Spotlight Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 pointer-events-auto transition-all duration-500"
                style={{
                    maskImage: targetRect
                        ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 1.2}px, black ${Math.max(targetRect.width, targetRect.height) / 1.2 + 20}px)`
                        : 'none',
                    WebkitMaskImage: targetRect
                        ? `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 1.2}px, black ${Math.max(targetRect.width, targetRect.height) / 1.2 + 20}px)`
                        : 'none'
                } as any}
            />

            {/* Tooltip Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        // Postion logic
                        left: currentStep?.position === 'center' ? '50%' :
                            currentStep?.position === 'left' ? targetRect ? targetRect.left : '50%' :
                                targetRect ? targetRect.right : '50%',
                        top: currentStep?.position === 'center' ? '50%' :
                            currentStep?.position === 'top' && targetRect ? targetRect.top - 20 :
                                currentStep?.position === 'bottom' && targetRect ? targetRect.bottom + 20 : '50%',
                        x: currentStep?.position === 'center' ? '-50%' :
                            currentStep?.position === 'left' ? '-100%' : '0%',
                        y: currentStep?.position === 'center' ? '-50%' :
                            currentStep?.position === 'top' ? '-100%' : '0%'
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`absolute pointer-events-auto bg-[var(--bg-secondary)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl ${currentStep?.position === 'center' ? 'w-[90%] max-w-[400px]' : 'w-[320px]'
                        }`}
                >
                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-[var(--dynamic-accent-start)] to-transparent opacity-50 pointer-events-none" />

                    <div className="relative p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-[var(--dynamic-accent-start)]/20 rounded-xl text-[var(--dynamic-accent-start)]">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <button onClick={handleSkip} className="text-[var(--text-tertiary)] hover:text-white transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{currentStep?.title}</h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                            {currentStep?.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {TOUR_STEPS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex
                                            ? 'w-6 bg-[var(--dynamic-accent-start)]'
                                            : 'w-1.5 bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {currentStepIndex > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all"
                                    >
                                        <ArrowRightIcon className="w-4 h-4 rotate-180" /> {/* Back Icon */}
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-5 py-2 bg-[var(--dynamic-accent-start)] hover:bg-[var(--dynamic-accent-end)] text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-[var(--dynamic-accent-glow)]/30 flex items-center gap-2"
                                >
                                    {currentStepIndex === TOUR_STEPS.length - 1 ? 'סיום' : 'הבא'}
                                    {currentStepIndex === TOUR_STEPS.length - 1 ? <CheckCircleIcon className="w-4 h-4" /> : <ArrowLeftIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>,
        document.body
    );
};

export default OnboardingTour;
