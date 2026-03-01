/**
 * useLoginAuth - Centralized auth logic for Login/Signup screens
 * 
 * Handles:
 * - Email/password login
 * - Google OAuth login
 * - Google redirect result handling
 * - Loading and error states
 */
import { useState, useEffect, useCallback } from 'react';
import {
    signIn,
    signInWithGoogle,
    checkGoogleRedirectResult
} from '../services/authService';
import { ERRORS } from '../utils/errorMessages';

interface UseLoginAuthReturn {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    isLoading: boolean;
    handleEmailLogin: (e: React.FormEvent) => Promise<void>;
    handleGoogleLogin: () => Promise<void>;
}

export const useLoginAuth = (): UseLoginAuthReturn => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Check for Google redirect result on mount
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                setIsLoading(true);
                const user = await checkGoogleRedirectResult();
                if (user) {
                    // Google redirect sign-in successful
                }
            } catch (err: unknown) {
                // RED TEAM: Generic error for public facing UI
                console.error('Google Auth Error:', err);
                setError(ERRORS.AUTH.GOOGLE_FAILED);
            } finally {
                setIsLoading(false);
            }
        };

        handleRedirectResult();
    }, []);

    const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signIn(email, password);
        } catch (err: unknown) {
            // RED TEAM: Prevent User Enumeration
            // We log the real error internally but show a generic message to the user
            console.warn('Login attempt failed:', err);
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    }, [email, password]);

    const handleGoogleLogin = useCallback(async () => {
        setError('');
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: unknown) {
            console.error('Google Sign-in Error:', err);
            setError(ERRORS.AUTH.GOOGLE_FAILED);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // RED TEAM: Security cleanup
    useEffect(() => {
        return () => {
            setPassword(''); // Clear sensitive data on unmount
            setError('');
        };
    }, []);

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        isLoading,
        handleEmailLogin,
        handleGoogleLogin,
    };
};

export default useLoginAuth;
