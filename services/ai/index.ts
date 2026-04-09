/**
 * AI Services Index
 * 
 * Re-exports all AI utilities for convenient single-import access.
 * This module provides a unified API for all AI functionality.
 * 
 * @module ai
 */

// Core client and utilities
export {
    ai,
    isAiAvailable,
    parseAiJson,
    loadSettings,
    parseAIError,
} from './geminiClient';

// Search functionality
export {
    performAiSearch,
    universalAiSearch,
    findRelatedItems,
    findRelatedPersonalItems,
} from './searchService';

// NLP and parsing
export {
    parseNaturalLanguageTask,
    smartParseInput,
} from './nlpService';

// Content generation
export {
    summarizeItemContent,
    generateMentorContent,
    generateDailyBriefing,
    summarizeSpaceContent,
    generateComfortZoneChallenge,
} from './contentService';

// Roadmap generation
export {
    generateTasksForPhase,
    generateRoadmap,
} from './roadmapService';

// AI suggestions
export {
    suggestIconForTitle,
    suggestExercises,
    suggestTagsForSite,
} from './suggestionsService';

// Chat and assistant
export {
    createAssistantChat,
    getExerciseTutorial,
    askExerciseQuestion,
    type ExerciseChatMessage,
} from './chatService';

// Feed generation
export {
    getUrlMetadata,
    generateAiFeedItems,
    type AiGeneratedFeedItem,
} from './feedService';

