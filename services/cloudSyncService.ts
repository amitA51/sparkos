/**
 * Cloud Sync Service
 * 
 * Manages real-time Firestore subscriptions for all user data.
 * Ensures data is loaded from the cloud when user signs in.
 */

import { auth } from '../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
    subscribeToPersonalItems,
    subscribeToBodyWeight,
    subscribeToWorkoutSessions,
    subscribeToWorkoutTemplates,
    subscribeToSettings,
    subscribeToSpaces,
    subscribeToTags,
    subscribeToQuotes,
    subscribeToFeedItems,
    subscribeToTemplates,
    subscribeToWatchlist,
    subscribeToPersonalExercises,
    subscribeToRssFeeds,
    subscribeToMentors,
    subscribeToComfortZone,
} from './firestoreService';
import {
    PersonalItem,
    BodyWeightEntry,
    WorkoutSession,
    WorkoutTemplate,
    AppSettings,
    Space,
    Tag,
    Quote,
    FeedItem,
    Template,
    WatchlistItem,
    PersonalExercise,
    RssFeed,
    Mentor,
    ComfortZoneChallenge,
} from '../types';

// Type definitions for callback handlers
export interface CloudSyncCallbacks {
    onPersonalItemsUpdate?: (items: PersonalItem[]) => void;
    onBodyWeightUpdate?: (entries: BodyWeightEntry[]) => void;
    onWorkoutSessionsUpdate?: (sessions: WorkoutSession[]) => void;
    onWorkoutTemplatesUpdate?: (templates: WorkoutTemplate[]) => void;
    onSettingsUpdate?: (settings: AppSettings | null) => void;
    onSpacesUpdate?: (spaces: Space[]) => void;
    onTagsUpdate?: (tags: Tag[]) => void;
    onQuotesUpdate?: (quotes: Quote[]) => void;
    onFeedItemsUpdate?: (items: FeedItem[]) => void;
    onTemplatesUpdate?: (templates: Template[]) => void;
    onWatchlistUpdate?: (items: WatchlistItem[]) => void;
    onPersonalExercisesUpdate?: (exercises: PersonalExercise[]) => void;
    onRssFeedsUpdate?: (feeds: RssFeed[]) => void;
    onMentorsUpdate?: (mentors: Mentor[]) => void;
    onComfortZoneUpdate?: (challenge: ComfortZoneChallenge | null) => void;
}

class CloudSyncService {
    private unsubscribeAuth: (() => void) | null = null;
    private unsubscribePersonalItems: (() => void) | null = null;
    private unsubscribeBodyWeight: (() => void) | null = null;
    private unsubscribeWorkoutSessions: (() => void) | null = null;
    private unsubscribeWorkoutTemplates: (() => void) | null = null;
    private unsubscribeSettings: (() => void) | null = null;
    private unsubscribeSpaces: (() => void) | null = null;
    private unsubscribeTags: (() => void) | null = null;
    private unsubscribeQuotes: (() => void) | null = null;
    private unsubscribeFeedItems: (() => void) | null = null;
    private unsubscribeTemplates: (() => void) | null = null;
    private unsubscribeWatchlist: (() => void) | null = null;
    private unsubscribePersonalExercises: (() => void) | null = null;
    private unsubscribeRssFeeds: (() => void) | null = null;
    private unsubscribeMentors: (() => void) | null = null;
    private unsubscribeComfortZone: (() => void) | null = null;
    private callbacks: CloudSyncCallbacks = {};
    private isInitialized = false;

    /**
     * Initialize the cloud sync service with callbacks for each data type.
     * Call this once when the app starts.
     */
    initialize(callbacks: CloudSyncCallbacks) {
        if (this.isInitialized) {
            console.warn('CloudSyncService: Already initialized, skipping.');
            return;
        }

        this.callbacks = callbacks;
        this.isInitialized = true;

        // Listen for auth state changes
        if (!auth) {
            console.warn('CloudSyncService: Firebase Auth not initialized');
            return;
        }

        this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                this.startSubscriptions(user);
            } else {
                this.stopSubscriptions();
            }
        });
    }

    /**
     * Start all Firestore subscriptions for the authenticated user
     */
    private startSubscriptions(user: User) {
        // 🛡️ Guard: Stop any existing subscriptions before starting new ones
        this.stopSubscriptions();

        // Store the current UID to validate in callbacks
        const currentUid = user.uid;

        // Personal Items
        if (this.callbacks.onPersonalItemsUpdate) {
            this.unsubscribePersonalItems = subscribeToPersonalItems(
                user.uid,
                (items) => {
                    // 🛡️ Guard: Verify user hasn't changed during async operation
                    if (auth?.currentUser?.uid !== currentUid) return;
                    this.callbacks.onPersonalItemsUpdate?.(items);
                }
            );
        }

        // Body Weight
        if (this.callbacks.onBodyWeightUpdate) {
            this.unsubscribeBodyWeight = subscribeToBodyWeight(
                user.uid,
                (entries) => {
                    this.callbacks.onBodyWeightUpdate?.(entries);
                }
            );
        }

        // Workout Sessions
        if (this.callbacks.onWorkoutSessionsUpdate) {
            this.unsubscribeWorkoutSessions = subscribeToWorkoutSessions(
                user.uid,
                (sessions) => {
                    this.callbacks.onWorkoutSessionsUpdate?.(sessions);
                }
            );
        }

        // Workout Templates
        if (this.callbacks.onWorkoutTemplatesUpdate) {
            this.unsubscribeWorkoutTemplates = subscribeToWorkoutTemplates(
                user.uid,
                (templates) => {
                    this.callbacks.onWorkoutTemplatesUpdate?.(templates);
                }
            );
        }

        // Settings
        if (this.callbacks.onSettingsUpdate) {
            this.unsubscribeSettings = subscribeToSettings(
                user.uid,
                (settings) => {
                    this.callbacks.onSettingsUpdate?.(settings);
                }
            );
        }

        // Spaces
        if (this.callbacks.onSpacesUpdate) {
            this.unsubscribeSpaces = subscribeToSpaces(
                user.uid,
                (spaces) => {
                    this.callbacks.onSpacesUpdate?.(spaces);
                }
            );
        }

        // Tags
        if (this.callbacks.onTagsUpdate) {
            this.unsubscribeTags = subscribeToTags(
                user.uid,
                (tags) => {
                    this.callbacks.onTagsUpdate?.(tags);
                }
            );
        }

        // Quotes
        if (this.callbacks.onQuotesUpdate) {
            this.unsubscribeQuotes = subscribeToQuotes(
                user.uid,
                (quotes) => {
                    this.callbacks.onQuotesUpdate?.(quotes);
                }
            );
        }

        // Feed Items
        if (this.callbacks.onFeedItemsUpdate) {
            this.unsubscribeFeedItems = subscribeToFeedItems(
                user.uid,
                (items) => {
                    this.callbacks.onFeedItemsUpdate?.(items);
                }
            );
        }

        // Templates
        if (this.callbacks.onTemplatesUpdate) {
            this.unsubscribeTemplates = subscribeToTemplates(
                user.uid,
                (templates) => {
                    this.callbacks.onTemplatesUpdate?.(templates);
                }
            );
        }

        // Watchlist
        if (this.callbacks.onWatchlistUpdate) {
            this.unsubscribeWatchlist = subscribeToWatchlist(
                user.uid,
                (items) => {
                    this.callbacks.onWatchlistUpdate?.(items);
                }
            );
        }

        // Personal Exercises
        if (this.callbacks.onPersonalExercisesUpdate) {
            this.unsubscribePersonalExercises = subscribeToPersonalExercises(
                user.uid,
                (exercises) => {
                    this.callbacks.onPersonalExercisesUpdate?.(exercises);
                }
            );
        }

        // RSS Feeds
        if (this.callbacks.onRssFeedsUpdate) {
            this.unsubscribeRssFeeds = subscribeToRssFeeds(
                user.uid,
                (feeds) => {
                    this.callbacks.onRssFeedsUpdate?.(feeds);
                }
            );
        }

        // Custom Mentors
        if (this.callbacks.onMentorsUpdate) {
            this.unsubscribeMentors = subscribeToMentors(
                user.uid,
                (mentors) => {
                    this.callbacks.onMentorsUpdate?.(mentors);
                }
            );
        }

        // Comfort Zone Challenge
        if (this.callbacks.onComfortZoneUpdate) {
            this.unsubscribeComfortZone = subscribeToComfortZone(
                user.uid,
                (challenge) => {
                    this.callbacks.onComfortZoneUpdate?.(challenge);
                }
            );
        }
    }

    /**
     * Stop all Firestore subscriptions
     */
    private stopSubscriptions() {
        if (this.unsubscribePersonalItems) {
            this.unsubscribePersonalItems();
            this.unsubscribePersonalItems = null;
        }
        if (this.unsubscribeBodyWeight) {
            this.unsubscribeBodyWeight();
            this.unsubscribeBodyWeight = null;
        }
        if (this.unsubscribeWorkoutSessions) {
            this.unsubscribeWorkoutSessions();
            this.unsubscribeWorkoutSessions = null;
        }
        if (this.unsubscribeWorkoutTemplates) {
            this.unsubscribeWorkoutTemplates();
            this.unsubscribeWorkoutTemplates = null;
        }
        if (this.unsubscribeSettings) {
            this.unsubscribeSettings();
            this.unsubscribeSettings = null;
        }
        if (this.unsubscribeSpaces) {
            this.unsubscribeSpaces();
            this.unsubscribeSpaces = null;
        }
        if (this.unsubscribeTags) {
            this.unsubscribeTags();
            this.unsubscribeTags = null;
        }
        if (this.unsubscribeQuotes) {
            this.unsubscribeQuotes();
            this.unsubscribeQuotes = null;
        }
        if (this.unsubscribeFeedItems) {
            this.unsubscribeFeedItems();
            this.unsubscribeFeedItems = null;
        }
        if (this.unsubscribeTemplates) {
            this.unsubscribeTemplates();
            this.unsubscribeTemplates = null;
        }
        if (this.unsubscribeWatchlist) {
            this.unsubscribeWatchlist();
            this.unsubscribeWatchlist = null;
        }
        if (this.unsubscribePersonalExercises) {
            this.unsubscribePersonalExercises();
            this.unsubscribePersonalExercises = null;
        }
        if (this.unsubscribeRssFeeds) {
            this.unsubscribeRssFeeds();
            this.unsubscribeRssFeeds = null;
        }
        if (this.unsubscribeMentors) {
            this.unsubscribeMentors();
            this.unsubscribeMentors = null;
        }
        if (this.unsubscribeComfortZone) {
            this.unsubscribeComfortZone();
            this.unsubscribeComfortZone = null;
        }
    }

    /**
     * Cleanup the service (call on app unmount if needed)
     */
    cleanup() {
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
            this.unsubscribeAuth = null;
        }
        this.stopSubscriptions();
        this.isInitialized = false;
    }
}

export const cloudSyncService = new CloudSyncService();

