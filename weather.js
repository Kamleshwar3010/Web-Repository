const btn = document.getElementById("btn");
const input = document.getElementById("input");
const switchcheck = document.getElementById("switchcheck");
const unitToggle = document.getElementById("unit-toggle-checkbox");

// Weather Data Elements
const cityName = document.getElementById("city-name");
const regionCountry = document.getElementById("region-country");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weather-condition");
const weatherIcon = document.getElementById("weather-icon");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const cloud = document.getElementById("cloud");
const aqi = document.getElementById("aqi");
const uvIndex = document.getElementById("uv-index");

let currentData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme based on system preference or default to light
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        switchcheck.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Default search
    input.value = "London";
    getData();
});

// Fetch Data
function getData() {
    const city = input.value;
    if (!city) return;

    const url = `http://api.weatherapi.com/v1/current.json?key=45605ed6b2ea43ee88363631222705&q=${city}&aqi=yes`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then((data) => {
            currentData = data;
            displayData(data);
            updateMap(data.location.lat, data.location.lon);
            input.value = "";
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            alert("City not found or API error.");
        });
}

// Display Data
function displayData(data) {
    const { location, current } = data;

    cityName.innerText = location.name;
    regionCountry.innerText = `${location.region}, ${location.country}`;

    updateTemperature();

    weatherCondition.innerText = current.condition.text;
    weatherIcon.innerHTML = `<img src="${current.condition.icon}" alt="${current.condition.text}">`;

    humidity.innerText = `${current.humidity}%`;
    cloud.innerText = `${current.cloud}%`;

    updateWindSpeed();

    // AQI
    const pm2_5 = current.air_quality.pm2_5;
    aqi.innerText = getAqiDescription(pm2_5);

    // UV
    uvIndex.innerText = getUvDescription(current.uv);
}

function updateTemperature() {
    if (!currentData) return;
    if (unitToggle.checked) {
        temperature.innerText = currentData.current.temp_f;
    } else {
        temperature.innerText = currentData.current.temp_c;
    }
}

function updateWindSpeed() {
    if (!currentData) return;
    if (unitToggle.checked) {
        windSpeed.innerText = `${currentData.current.wind_mph} mph`;
    } else {
        windSpeed.innerText = `${currentData.current.wind_kph} kph`;
    }
}

function getAqiDescription(pm2_5) {
    if (pm2_5 <= 12.0) return "Good";
    if (pm2_5 <= 35.4) return "Moderate";
    if (pm2_5 <= 55.4) return "Unhealthy for Sensitive Groups";
    if (pm2_5 <= 150.4) return "Unhealthy";
    if (pm2_5 <= 250.4) return "Very Unhealthy";
    return "Hazardous";
}

function getUvDescription(uv) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
}

// Map Update
function updateMap(lat, lon) {
    if (typeof map !== 'undefined') {
        map.flyTo({
            center: [lon, lat],
            zoom: 10,
            essential: true
        });

        // Remove existing markers (optional, but good practice)
        // Note: mapboxgl markers are added to the DOM, simplistic removal might be needed if many markers accumulate
        new mapboxgl.Marker()
            .setLngLat([lon, lat])
            .addTo(map);
    }
}

// Event Listeners
btn.addEventListener('click', getData);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getData();
    }
});

unitToggle.addEventListener('change', () => {
    updateTemperature();
    updateWindSpeed();
});

switchcheck.addEventListener('change', () => {
    if (switchcheck.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
});

