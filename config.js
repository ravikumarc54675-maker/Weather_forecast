// Open-Meteo public REST API endpoints (no key required)
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Auto-refresh interval for current conditions
const REFRESH_INTERVAL_SECONDS = 60;

// localStorage keys
const SAVED_CITIES_KEY = "SKYPULSE_SAVED_CITIES_V1";
const PREFS_KEY = "SKYPULSE_PREFS_V1";

// Manager PIN (client-side only - see README Security Note)
const MANAGE_PIN = "2468";
