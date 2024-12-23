const searchButton = document.getElementById("searchButton");
const locationInput = document.getElementById("locationInput");
const weatherInfo = document.getElementById("weatherInfo");
const locationName = document.getElementById("locationName");
const temperature = document.getElementById("temperature");
const conditions = document.getElementById("conditions");
const errorMessage = document.getElementById("errorMessage");

searchButton.addEventListener("click", async () => {
    const location = locationInput.value;
    if (!location) {
        showError("Please enter a location.");
        return;
    }
    const geocodeData = await fetchGeocode(location);
    if (!geocodeData) {
        showError("Location not found.");
        return;
    }
    fetchWeather(geocodeData.latitude, geocodeData.longitude);
});

async function fetchGeocode(location) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
        const data = await response.json();
        if (!data.results || data.results.length === 0) return null;
        return data.results[0];
    } catch (error) {
        console.error("Error fetching geocode:", error);
        return null;
    }
}

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        showError("Unable to fetch weather data.");
    }
}

function displayWeather(data) {
    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    locationName.textContent = `Latitude: ${data.latitude}, Longitude: ${data.longitude}`;
    temperature.textContent = `Temperature: ${data.current_weather.temperature}°C`;
    conditions.textContent = `Conditions: ${data.current_weather.weathercode}`;
}

function showError(message) {
    weatherInfo.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = message;
}
