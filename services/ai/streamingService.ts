/**
 * AI Streaming Service Module
 * 
 * Provides streaming response capabilities for real-time typewriter effects.
 * Use for chat, summaries, tutorials - anything displayed to user in real-time.
 * 
 * @module streamingService
 * @version 1.0.0
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ai } from './geminiClient';
import { loadSettings } from '../settingsService';

// ============================================================================
// Types
// ============================================================================

export interface StreamCallbacks {
    /** Called for each text chunk received */
    onChunk: (text: string) => void;
    /** Called when streaming completes successfully */
    onComplete: (fullText: string) => void;
    /** Called on error */
    onError: (error: Error) => void;
}

export interface StreamOptions {
    /** AbortSignal to cancel the stream */
    signal?: AbortSignal;
    /** Timeout in ms (default: 60000) */
    timeoutMs?: number;
    /** Custom model override */
    model?: string;
}

// ============================================================================
// Core Streaming Function
// ============================================================================

/**
 * Streams AI response with typewriter effect.
 * 
 * @example
 * ```ts
 * await streamAIResponse(prompt, {
 *   onChunk: (text) => setDisplayText(prev => prev + text),
 *   onComplete: (full) => console.log('Done:', full),
 *   onError: (err) => console.error(err),
 * });
 * ```
 */
export const streamAIResponse = async (
    prompt: string,
    callbacks: StreamCallbacks,
    options?: StreamOptions
): Promise<void> => {
    if (!ai) {
        callbacks.onError(new Error('API Key not configured.'));
        return;
    }

    const settings = loadSettings();
    const model = options?.model || settings.aiModel;
    const timeoutMs = options?.timeoutMs || 60000;
    let fullText = '';
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
        // Set up timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('Stream timed out'));
            }, timeoutMs);
        });

        // Start streaming
        const streamPromise = (async () => {
            const response = await ai!.models.generateContentStream({
                model,
                contents: prompt,
            });

            for await (const chunk of response) {
                // Check for abort signal
                if (options?.signal?.aborted) {
                    callbacks.onComplete(fullText);
                    return;
                }

                const text = chunk.text || '';
                if (text) {
                    fullText += text;
                    callbacks.onChunk(text);
                }
            }

            callbacks.onComplete(fullText);
        })();

        // Race between stream and timeout
        await Promise.race([streamPromise, timeoutPromise]);
    } catch (error) {
        callbacks.onError(error as Error);
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
};

/**
 * Streams AI response with system instruction context.
 * Use for chat-like interactions with persona.
 */
export const streamAIWithContext = async (
    systemInstruction: string,
    userMessage: string,
    callbacks: StreamCallbacks,
    options?: StreamOptions
): Promise<void> => {
    if (!ai) {
        callbacks.onError(new Error('API Key not configured.'));
        return;
    }

    const settings = loadSettings();
    const model = options?.model || settings.aiModel;
    let fullText = '';

    try {
        const response = await ai.models.generateContentStream({
            model,
            contents: userMessage,
            config: {
                systemInstruction,
            },
        });

        for await (const chunk of response) {
            if (options?.signal?.aborted) {
                callbacks.onComplete(fullText);
                return;
            }

            const text = chunk.text || '';
            if (text) {
                fullText += text;
                callbacks.onChunk(text);
            }
        }

        callbacks.onComplete(fullText);
    } catch (error) {
        callbacks.onError(error as Error);
    }
};

// ============================================================================
// React Hook
// ============================================================================

export interface UseStreamingResponseReturn {
    /** Current accumulated text */
    displayText: string;
    /** Whether currently streaming */
    isStreaming: boolean;
    /** Any error that occurred */
    error: Error | null;
    /** Start streaming with given prompt */
    stream: (prompt: string) => Promise<void>;
    /** Start streaming with system context */
    streamWithContext: (systemInstruction: string, userMessage: string) => Promise<void>;
    /** Cancel current stream */
    cancel: () => void;
    /** Reset state */
    reset: () => void;
}

/**
 * React hook for streaming AI responses with typewriter effect.
 * 
 * @example
 * ```tsx
 * const { displayText, isStreaming, stream } = useStreamingResponse();
 * 
 * const handleSend = async (msg: string) => {
 *   await stream(`Answer this: ${msg}`);
 * };
 * 
 * return (
 *   <div>
 *     {displayText}
 *     {isStreaming && <BlinkingCursor />}
 *   </div>
 * );
 * ```
 */
export const useStreamingResponse = (): UseStreamingResponseReturn => {
    const [displayText, setDisplayText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            abortRef.current?.abort();
        };
    }, []);

    const stream = useCallback(async (prompt: string) => {
        // Cancel any existing stream
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setIsStreaming(true);
        setDisplayText('');
        setError(null);

        await streamAIResponse(prompt, {
            onChunk: (chunk) => setDisplayText(prev => prev + chunk),
            onComplete: () => setIsStreaming(false),
            onError: (err) => {
                setError(err);
                setIsStreaming(false);
            },
        }, { signal: abortRef.current.signal });
    }, []);

    const streamWithContext = useCallback(async (systemInstruction: string, userMessage: string) => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setIsStreaming(true);
        setDisplayText('');
        setError(null);

        await streamAIWithContext(systemInstruction, userMessage, {
            onChunk: (chunk) => setDisplayText(prev => prev + chunk),
            onComplete: () => setIsStreaming(false),
            onError: (err) => {
                setError(err);
                setIsStreaming(false);
            },
        }, { signal: abortRef.current.signal });
    }, []);

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setIsStreaming(false);
    }, []);

    const reset = useCallback(() => {
        abortRef.current?.abort();
        setDisplayText('');
        setIsStreaming(false);
        setError(null);
    }, []);

    return { displayText, isStreaming, error, stream, streamWithContext, cancel, reset };
};
