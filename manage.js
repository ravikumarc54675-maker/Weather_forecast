// Manage page logic: PIN gate and saved-city CRUD operations

const pinGate = document.getElementById("pin-gate");
const pinInput = document.getElementById("pin-input");
const pinSubmit = document.getElementById("pin-submit");
const pinError = document.getElementById("pin-error");
const managePanel = document.getElementById("manage-panel");
const cityTable = document.getElementById("city-table");
const newCityInput = document.getElementById("new-city-input");
const addCityBtn = document.getElementById("add-city-btn");

pinSubmit.addEventListener("click", () => {
  if (pinInput.value === MANAGE_PIN) {
    pinGate.hidden = true;
    managePanel.hidden = false;
    renderCityList();
  } else {
    pinError.textContent = "Incorrect PIN.";
  }
});

pinInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") pinSubmit.click();
});

addCityBtn.addEventListener("click", async () => {
  const name = newCityInput.value.trim();
  if (!name) return;

  try {
    const res = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=1&format=json`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error("City not found.");

    const place = data.results[0];
    const cities = getSavedCities();
    cities.push({
      cityId: "C" + Date.now(),
      name: `${place.name}, ${place.country}`,
      latitude: place.latitude,
      longitude: place.longitude,
      addedAt: new Date().toISOString()
    });
    saveSavedCities(cities);
    newCityInput.value = "";
    renderCityList();
  } catch (err) {
    alert(err.message);
  }
});

function getSavedCities() {
  return JSON.parse(localStorage.getItem(SAVED_CITIES_KEY) || "[]");
}

function saveSavedCities(cities) {
  localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(cities));
}

function removeCity(index) {
  const cities = getSavedCities();
  cities.splice(index, 1);
  saveSavedCities(cities);
  renderCityList();
}

function moveCity(index, direction) {
  const cities = getSavedCities();
  const target = index + direction;
  if (target < 0 || target >= cities.length) return;

  [cities[index], cities[target]] = [cities[target], cities[index]];
  saveSavedCities(cities);
  renderCityList();
}

function renderCityList() {
  const cities = getSavedCities();
  cityTable.textContent = "";

  cities.forEach((city, i) => {
    const row = cityTable.insertRow();
    row.insertCell().textContent = city.name;

    const actionsCell = row.insertCell();
    const upBtn = document.createElement("button");
    upBtn.textContent = "Up";
    upBtn.addEventListener("click", () => moveCity(i, -1));

    const downBtn = document.createElement("button");
    downBtn.textContent = "Down";
    downBtn.addEventListener("click", () => moveCity(i, 1));

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeCity(i));

    actionsCell.appendChild(upBtn);
    actionsCell.appendChild(downBtn);
    actionsCell.appendChild(removeBtn);
  });
}
