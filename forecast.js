// Forecast page logic: day tabs and auto-refresh timer

let forecastData = null;
let refreshInterval = null;
let timeLeft = REFRESH_INTERVAL_SECONDS;

const dayTabs = document.getElementById("day-tabs");
const forecastCard = document.getElementById("forecast-card");
const timerDisplay = document.getElementById("refresh-timer");
const errorMsg = document.getElementById("error-msg");

document.addEventListener("DOMContentLoaded", () => {
  loadForecast("Patna");
});

async function geocodeCity(cityName) {
  const res = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(cityName)}&count=1&format=json`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("Location not found.");
  return data.results[0];
}

async function loadForecast(cityName) {
  try {
    errorMsg.textContent = "";
    const place = await geocodeCity(cityName);
    const url = `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch forecast data.");
    forecastData = await res.json();
    forecastData.locationName = `${place.name}, ${place.country}`;
    renderDayTabs();
    renderDay(0);
    startAutoRefresh(REFRESH_INTERVAL_SECONDS);
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

function renderDayTabs() {
  dayTabs.textContent = "";
  forecastData.daily.time.forEach((date, i) => {
    const tab = document.createElement("button");
    tab.className = "btn";
    tab.textContent = date;
    tab.addEventListener("click", () => renderDay(i));
    dayTabs.appendChild(tab);
  });
}

function renderDay(index) {
  forecastCard.textContent = "";
  const max = forecastData.daily.temperature_2m_max[index];
  const min = forecastData.daily.temperature_2m_min[index];

  const title = document.createElement("h2");
  title.textContent = forecastData.locationName || forecastData.daily.time[index];
  forecastCard.appendChild(title);

  const date = document.createElement("p");
  date.textContent = forecastData.daily.time[index];
  forecastCard.appendChild(date);

  const range = document.createElement("div");
  range.className = "metric-primary";
  range.textContent = `${max}\u00b0 / ${min}\u00b0C`;
  forecastCard.appendChild(range);
}

function startAutoRefresh(seconds) {
  clearInterval(refreshInterval);
  timeLeft = seconds;
  updateTimerDisplay();

  refreshInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(refreshInterval);
      refreshCurrentConditions();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeLeft;
}

async function refreshCurrentConditions() {
  if (!forecastData) return;
  renderDay(0);
  startAutoRefresh(REFRESH_INTERVAL_SECONDS);
}
