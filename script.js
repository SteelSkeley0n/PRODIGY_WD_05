/* global fetch, navigator */
const API_KEY = "3cc1428c956d5407e48ab080fa75673b"; // ← paste yours here
const BASE_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + API_KEY;

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const locBtn = document.getElementById("loc-btn");
const weatherBox = document.getElementById("weather");
const errorBox = document.getElementById("error");

const cityNameEl = document.getElementById("city-name");
const descEl = document.getElementById("description");
const tempEl = document.getElementById("temp");
const iconEl = document.getElementById("icon");
const humEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

// ——— helpers ———
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
  weatherBox.classList.add("hidden");
}

function showWeather(data) {
  errorBox.classList.add("hidden");

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  descEl.textContent = data.weather[0].description.replace(/^\w/, c => c.toUpperCase());
  tempEl.textContent = Math.round(data.main.temp) + "°C";
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconEl.alt = data.weather[0].main;

  humEl.textContent = data.main.humidity + "%";
  windEl.textContent = data.wind.speed + " m/s";

  weatherBox.classList.remove("hidden");
}

// ——— fetch by city ———
form.addEventListener("submit", e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  fetch(BASE_URL + `&q=${encodeURIComponent(city)}`)
    .then(r => r.ok ? r.json() : Promise.reject("City not found"))
    .then(showWeather)
    .catch(err => showError(err));
  cityInput.value = "";
});

// ——— fetch by geolocation ———
locBtn.addEventListener("click", () => {
  if (!navigator.geolocation)
    return showError("Geolocation is not supported by your browser.");

  locBtn.disabled = true;
  locBtn.textContent = "Getting location…";

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      fetch(BASE_URL + `&lat=${latitude}&lon=${longitude}`)
        .then(r => r.ok ? r.json() : Promise.reject("Unable to get weather."))
        .then(showWeather)
        .catch(err => showError(err))
        .finally(() => {
          locBtn.disabled = false;
          locBtn.textContent = "Use My Location";
        });
    },
    () => {
      showError("Location access denied.");
      locBtn.disabled = false;
      locBtn.textContent = "Use My Location";
    }
  );
});
