import { useEffect, useState } from 'react';
import { requestFcmToken, isSupported } from '@/services/notificationsService';
import { useUser } from '@/src/contexts/UserContext';

export const usePushToken = () => {
    const { user } = useUser();
    const [token, setToken] = useState<string | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );

    useEffect(() => {
        try {
            if (!isSupported()) return;

            // Check initial permission
            setPermission(Notification.permission);

            // If already granted and user is logged in, ensure we have a token
            if (Notification.permission === 'granted' && user) {
                requestFcmToken(user.uid)
                    .then(t => {
                        if (t) setToken(t);
                    })
                    .catch(e => console.error("Failed to auto-fetch token:", e));
            }
        } catch (e) {
            console.error("usePushToken effect error:", e);
        }
    }, [user]);

    const requestToken = async () => {
        if (!user) {
            console.warn('Cannot request push token without user (for linking)');
            return null;
        }

        const t = await requestFcmToken(user.uid);
        if (t) {
            setToken(t);
            setPermission(Notification.permission);
        }
        return t;
    };

    return {
        token,
        permission,
        requestToken,
        isSupported: isSupported()
    };
};
