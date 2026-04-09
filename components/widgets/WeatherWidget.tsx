import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudIcon, SunIcon, RefreshIcon } from '../icons';

// ============================================================================
// Types
// ============================================================================

interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  conditionText: string;
  city: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
  fetchedAt: number;
}

interface ForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
}

type WeatherCondition =
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy';

// ============================================================================
// Constants
// ============================================================================

const CACHE_KEY = 'sparkos_weather_cache';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const FALLBACK_LOCATION = { lat: 32.0853, lon: 34.7818, city: 'תל אביב' };

const CONDITION_ICONS: Record<WeatherCondition, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
  foggy: '🌫️',
  windy: '💨',
};

const CONDITION_GRADIENTS: Record<WeatherCondition, string> = {
  sunny: 'from-amber-500/25 via-orange-400/15 to-yellow-300/10',
  partly_cloudy: 'from-sky-400/20 via-blue-300/15 to-slate-300/10',
  cloudy: 'from-slate-400/25 via-gray-400/15 to-zinc-400/10',
  rainy: 'from-blue-500/25 via-indigo-400/15 to-slate-500/10',
  stormy: 'from-purple-600/25 via-indigo-500/15 to-slate-600/10',
  snowy: 'from-cyan-200/25 via-blue-200/15 to-white/10',
  foggy: 'from-gray-400/25 via-slate-300/15 to-zinc-300/10',
  windy: 'from-teal-400/20 via-cyan-300/15 to-sky-300/10',
};

const CONDITION_LABELS_HE: Record<WeatherCondition, string> = {
  sunny: 'שמשי',
  partly_cloudy: 'מעונן חלקית',
  cloudy: 'מעונן',
  rainy: 'גשום',
  stormy: 'סוער',
  snowy: 'שלגי',
  foggy: 'ערפילי',
  windy: 'סוער',
};

// ============================================================================
// API Helpers
// ============================================================================

/** Map WMO weather codes from open-meteo to our condition enum */
function wmoToCondition(code: number): WeatherCondition {
  if (code <= 1) return 'sunny';
  if (code === 2) return 'partly_cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'foggy';
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95) return 'stormy';
  return 'cloudy';
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('he-IL', { weekday: 'short' });
}

async function fetchWeatherFromAPI(
  lat: number,
  lon: number,
  cityName: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

  const data = await response.json();

  const currentCondition = wmoToCondition(data.current.weather_code);

  // Build 3-day forecast (skip today at index 0)
  const forecast: ForecastDay[] = [];
  for (let i = 1; i <= 3 && i < data.daily.time.length; i++) {
    forecast.push({
      date: data.daily.time[i],
      dayName: getDayName(data.daily.time[i]),
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      condition: wmoToCondition(data.daily.weather_code[i]),
    });
  }

  return {
    temperature: Math.round(data.current.temperature_2m),
    condition: currentCondition,
    conditionText: CONDITION_LABELS_HE[currentCondition],
    city: cityName,
    humidity: Math.round(data.current.relative_humidity_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    forecast,
    fetchedAt: Date.now(),
  };
}

// ============================================================================
// Cache Helpers
// ============================================================================

function loadCachedWeather(): WeatherData | null {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    const parsed: WeatherData = JSON.parse(stored);
    if (Date.now() - parsed.fetchedAt > CACHE_DURATION_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveWeatherCache(data: WeatherData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable -- silent fail
  }
}

// ============================================================================
// Geolocation Helper
// ============================================================================

function getUserLocation(): Promise<{ lat: number; lon: number; city: string }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          city: '', // Will be resolved via reverse geocoding or left as coordinates
        });
      },
      () => {
        // Permission denied or error -- use fallback
        resolve(FALLBACK_LOCATION);
      },
      { timeout: 5000, maximumAge: 600000 }
    );
  });
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    // Use nominatim for reverse geocoding (open-meteo does not support it)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=he`
    );
    if (!response.ok) return '';
    const data = await response.json();
    return data.address?.city || data.address?.town || data.address?.village || '';
  } catch {
    return '';
  }
}

// ============================================================================
// Component
// ============================================================================

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless forced)
    if (!forceRefresh) {
      const cached = loadCachedWeather();
      if (cached) {
        setWeather(cached);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const location = await getUserLocation();

      // Resolve city name if we got real coordinates
      let cityName = location.city;
      if (!cityName && location.lat !== FALLBACK_LOCATION.lat) {
        cityName = await reverseGeocode(location.lat, location.lon);
      }
      if (!cityName) {
        // Check if it's the fallback location
        if (
          location.lat === FALLBACK_LOCATION.lat &&
          location.lon === FALLBACK_LOCATION.lon
        ) {
          cityName = FALLBACK_LOCATION.city;
        } else {
          cityName = `${location.lat.toFixed(1)}, ${location.lon.toFixed(1)}`;
        }
      }

      const data = await fetchWeatherFromAPI(location.lat, location.lon, cityName);
      setWeather(data);
      saveWeatherCache(data);
    } catch {
      setError('לא ניתן לטעון נתוני מזג אוויר');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const gradient = useMemo(() => {
    if (!weather) return CONDITION_GRADIENTS.sunny;
    return CONDITION_GRADIENTS[weather.condition];
  }, [weather]);

  // Loading state
  if (isLoading && !weather) {
    return (
      <div className="spark-card relative overflow-hidden p-5">
        <div className={`absolute inset-0 bg-gradient-to-br ${CONDITION_GRADIENTS.partly_cloudy} pointer-events-none`} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="h-12 w-16 bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="relative z-10 flex gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !weather) {
    return (
      <div className="spark-card relative overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-theme-secondary">
            <CloudIcon className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={() => fetchWeather(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshIcon className="w-4 h-4 text-theme-secondary" />
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="spark-card relative overflow-hidden"
    >
      {/* Dynamic gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 p-5">
        {/* Header: city + refresh */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--dynamic-accent-color)] border border-white/10 flex items-center justify-center">
              <SunIcon className="w-5 h-5" style={{ color: 'var(--dynamic-accent-start)' }} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                מזג אוויר
              </h3>
              <p className="text-xs text-theme-secondary">{weather.city}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchWeather(true)}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors disabled:opacity-50"
            title="רענן"
          >
            <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* Current weather */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={weather.condition}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-5xl"
              >
                {CONDITION_ICONS[weather.condition]}
              </motion.span>
            </AnimatePresence>
            <div>
              <motion.p
                key={weather.temperature}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-white tracking-tight"
                dir="ltr"
              >
                {weather.temperature}°
              </motion.p>
              <p className="text-sm text-theme-secondary">
                {weather.conditionText}
              </p>
            </div>
          </div>

          {/* Mini stats */}
          <div className="flex flex-col gap-1.5 items-end text-xs text-theme-secondary">
            <span className="flex items-center gap-1.5">
              💧 {weather.humidity}%
            </span>
            <span className="flex items-center gap-1.5" dir="ltr">
              💨 {weather.windSpeed} km/h
            </span>
          </div>
        </div>

        {/* 3-day forecast */}
        <div className="flex gap-2">
          {weather.forecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center"
            >
              <p className="text-[11px] font-medium text-theme-secondary mb-1.5">
                {day.dayName}
              </p>
              <span className="text-xl block mb-1">
                {CONDITION_ICONS[day.condition]}
              </span>
              <div className="flex items-center justify-center gap-1.5 text-xs" dir="ltr">
                <span className="font-semibold text-white">
                  {day.tempMax}°
                </span>
                <span className="text-theme-muted">/</span>
                <span className="text-theme-muted">
                  {day.tempMin}°
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[10px] text-theme-muted text-center">
            עודכן {new Date(weather.fetchedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(WeatherWidget);
