// Compare page logic: fetches weather for every saved city and summarizes it

const compareTable = document.getElementById("compare-table");
const summaryBox = document.getElementById("summary-box");
const errorMsg = document.getElementById("error-msg");

document.addEventListener("DOMContentLoaded", loadComparison);

async function loadComparison() {
  try {
    const cities = JSON.parse(localStorage.getItem(SAVED_CITIES_KEY) || "[]");
    if (cities.length === 0) {
      errorMsg.textContent = "No saved cities yet. Save a city from the Home page first.";
      return;
    }

    const snapshots = await Promise.all(cities.map(fetchSnapshot));
    renderComparisonTable(cities, snapshots);
    renderSummary(cities, snapshots);
  } catch (err) {
    errorMsg.textContent = err.message;
  }
}

async function fetchSnapshot(city) {
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}` +
    `&current_weather=true&hourly=relativehumidity_2m`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    temperature: data.current_weather.temperature,
    windSpeed: data.current_weather.windspeed,
    humidity: data.hourly?.relativehumidity_2m?.[0] ?? "--"
  };
}

function renderComparisonTable(cities, snapshots) {
  compareTable.textContent = "";
  const header = compareTable.insertRow();
  ["City", "Temp (\u00b0C)", "Wind (km/h)", "Humidity (%)"].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    header.appendChild(th);
  });

  cities.forEach((city, i) => {
    const row = compareTable.insertRow();
    [city.name, snapshots[i].temperature, snapshots[i].windSpeed, snapshots[i].humidity]
      .forEach((val) => {
        const cell = row.insertCell();
        cell.textContent = val;
      });
  });
}

function computeSummary(snapshots) {
  const warmest = snapshots.reduce((a, b) => (b.temperature > a.temperature ? b : a));
  const coldest = snapshots.reduce((a, b) => (b.temperature < a.temperature ? b : a));
  const windiest = snapshots.reduce((a, b) => (b.windSpeed > a.windSpeed ? b : a));
  return { warmest, coldest, windiest };
}

function renderSummary(cities, snapshots) {
  const { warmest, coldest, windiest } = computeSummary(snapshots);
  summaryBox.textContent =
    `Warmest: ${cities[snapshots.indexOf(warmest)].name} | ` +
    `Coldest: ${cities[snapshots.indexOf(coldest)].name} | ` +
    `Windiest: ${cities[snapshots.indexOf(windiest)].name}`;
}
