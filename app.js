// Home page logic: loads and renders the current city's live weather

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const geoBtn = document.getElementById("geo-btn");
const weatherCard = document.getElementById("weather-card");
const errorMsg = document.getElementById("error-msg");
const cityChips = document.getElementById("city-chips");

document.addEventListener("DOMContentLoaded", () => {
  renderSavedChips();
  loadCityWeather("Patna");
});

searchBtn.addEventListener("click", () => {
  const query = cityInput.value.trim();
  if (query) loadCityWeather(query);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    errorMsg.textContent = "Geolocation is not supported by your browser.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => loadCityByCoords(pos.coords.latitude, pos.coords.longitude),
    () => { errorMsg.textContent = "Unable to retrieve your location."; }
  );
});

async function geocodeCity(cityName) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(cityName)}&count=1&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("Location not found. Please enter a valid city name.");
  }
  return data.results[0];
}

async function fetchCurrentWeather(lat, lon) {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data.");
  return await res.json();
}

async function loadCityWeather(cityName) {
  try {
    errorMsg.textContent = "";
    const place = await geocodeCity(cityName);
    const data = await fetchCurrentWeather(place.latitude, place.longitude);
    renderWeatherCard(`${place.name}, ${place.country}`, place, data);
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

async function loadCityByCoords(lat, lon) {
  try {
    errorMsg.textContent = "";
    const data = await fetchCurrentWeather(lat, lon);
    renderWeatherCard("Your Current Location", { latitude: lat, longitude: lon }, data);
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

function renderWeatherCard(locationName, place, data) {
  weatherCard.textContent = "";

  const title = document.createElement("h2");
  title.textContent = locationName;
  weatherCard.appendChild(title);

  const temp = document.createElement("div");
  temp.className = "metric-primary";
  temp.textContent = `${Math.round(data.current_weather.temperature)}\u00b0C`;
  weatherCard.appendChild(temp);

  const detail = document.createElement("p");
  detail.textContent = `Wind: ${data.current_weather.windspeed} km/h`;
  weatherCard.appendChild(detail);

  if (data.hourly && data.hourly.relativehumidity_2m) {
    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${data.hourly.relativehumidity_2m[0]}%`;
    weatherCard.appendChild(humidity);
  }

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-secondary";
  saveBtn.textContent = "Save City";
  saveBtn.addEventListener("click", () => saveCurrentCity(locationName, place));
  weatherCard.appendChild(saveBtn);
}

function saveCurrentCity(name, place) {
  const cities = JSON.parse(localStorage.getItem(SAVED_CITIES_KEY) || "[]");
  cities.push({
    cityId: "C" + Date.now(),
    name,
    latitude: place.latitude,
    longitude: place.longitude,
    addedAt: new Date().toISOString()
  });
  localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(cities));
  renderSavedChips();
}

function renderSavedChips() {
  const cities = JSON.parse(localStorage.getItem(SAVED_CITIES_KEY) || "[]");
  cityChips.textContent = "";
  cities.forEach((c) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = c.name;
    cityChips.appendChild(chip);
  });
}
