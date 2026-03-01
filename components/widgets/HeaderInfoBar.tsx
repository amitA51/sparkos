import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
    temperature: number;
    weatherCode: number;
    feelsLike?: number;
}

// Weather code to icon and description mapping (WMO codes)
const getWeatherInfo = (code: number): { icon: string; gradient: string; description: string } => {
    if (code === 0) return {
        icon: '☀️',
        gradient: 'from-amber-400/20 to-orange-400/10',
        description: 'בהיר'
    };
    if (code <= 3) return {
        icon: '⛅',
        gradient: 'from-blue-400/20 to-slate-400/10',
        description: 'מעונן חלקית'
    };
    if (code <= 49) return {
        icon: '🌫️',
        gradient: 'from-slate-400/20 to-gray-400/10',
        description: 'ערפל'
    };
    if (code <= 59) return {
        icon: '🌧️',
        gradient: 'from-blue-500/20 to-slate-500/10',
        description: 'גשם קל'
    };
    if (code <= 69) return {
        icon: '🌧️',
        gradient: 'from-blue-600/20 to-indigo-500/10',
        description: 'גשם'
    };
    if (code <= 79) return {
        icon: '❄️',
        gradient: 'from-cyan-400/20 to-blue-300/10',
        description: 'שלג'
    };
    if (code <= 99) return {
        icon: '⛈️',
        gradient: 'from-purple-500/20 to-slate-600/10',
        description: 'סופה'
    };
    return {
        icon: '🌤️',
        gradient: 'from-blue-400/20 to-cyan-400/10',
        description: 'נאה'
    };
};

const HeaderInfoBar: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoadingWeather, setIsLoadingWeather] = useState(true);
    const [showSeconds, setShowSeconds] = useState(false);

    // Update clock every second when showing seconds, otherwise every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, showSeconds ? 1000 : 60000);

        return () => clearInterval(timer);
    }, [showSeconds]);

    // Fetch weather data
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 600000,
                    });
                });

                const { latitude, longitude } = position.coords;

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,apparent_temperature&timezone=auto`
                );

                if (!response.ok) throw new Error('Weather fetch failed');

                const data = await response.json();
                setWeather({
                    temperature: Math.round(data.current.temperature_2m),
                    weatherCode: data.current.weather_code,
                    feelsLike: Math.round(data.current.apparent_temperature),
                });
            } catch (error) {
                console.warn('Weather fetch failed:', error);
            } finally {
                setIsLoadingWeather(false);
            }
        };

        fetchWeather();
        const weatherTimer = setInterval(fetchWeather, 1800000);
        return () => clearInterval(weatherTimer);
    }, []);

    // Format time
    const formattedTime = useMemo(() => {
        return currentTime.toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
            second: showSeconds ? '2-digit' : undefined,
            hour12: false,
        });
    }, [currentTime, showSeconds]);

    // Get greeting based on time
    const greeting = useMemo(() => {
        const hour = currentTime.getHours();
        if (hour >= 5 && hour < 12) return 'בוקר טוב';
        if (hour >= 12 && hour < 17) return 'צהריים טובים';
        if (hour >= 17 && hour < 21) return 'ערב טוב';
        return 'לילה טוב';
    }, [currentTime]);

    const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.2, 0, 0, 1] }}
            className="flex items-center gap-2"
        >
            {/* Clock Capsule - cleaner, minimal */}
            <motion.button
                onClick={() => setShowSeconds(!showSeconds)}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-200 cursor-pointer"
            >

                {/* Time */}
                <span className="relative text-lg font-bold text-white/90 font-display tracking-tight tabular-nums">
                    {formattedTime}
                </span>

                {/* Greeting badge */}
                <span className="relative text-[10px] font-semibold text-white/35 uppercase tracking-wider">
                    {greeting}
                </span>
            </motion.button>

            {/* Weather Capsule - calmer */}
            <AnimatePresence mode="wait">
                {weather && !isLoadingWeather && weatherInfo && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -10 }}
                        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-200 cursor-default"
                    >
                        {/* Weather icon */}
                        <motion.span
                            className="text-xl"
                        >
                            {weatherInfo.icon}
                        </motion.span>

                        {/* Temperature */}
                        <div className="flex flex-col items-start -space-y-0.5">
                            <span className="text-base font-bold text-white/95 tabular-nums">
                                {weather.temperature}°
                            </span>
                            {weather.feelsLike !== weather.temperature && (
                                <span className="text-[9px] font-medium text-white/40">
                                    מרגיש {weather.feelsLike}°
                                </span>
                            )}
                        </div>

                        {/* Weather description tooltip on hover */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg surface-elevated border border-white/10 text-[10px] font-medium text-theme-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            {weatherInfo.description}
                        </div>
                    </motion.div>
                )}

                {/* Loading skeleton */}
                {isLoadingWeather && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/5"
                    >
                        <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />
                        <div className="w-8 h-4 rounded bg-white/10 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default React.memo(HeaderInfoBar);
