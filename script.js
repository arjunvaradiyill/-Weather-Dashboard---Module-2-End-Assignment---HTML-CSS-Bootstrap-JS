const apiKey = 'befd984de4d3c050671d4eb935e6c660';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const tempValue = document.getElementById('tempValue');
const weatherDescription = document.getElementById('weatherDescription');
const locationDisplay = document.getElementById('location');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherIcon = document.getElementById('weatherIcon');
const spinner = document.getElementById('spinner');
const errorDisplay = document.getElementById('error');
const weatherDisplay = document.getElementById('weatherDisplay');

// Event listeners
searchBtn.addEventListener('click', handleCitySearch);
cityInput.addEventListener('keydown', (e) => e.key === 'Enter' && handleCitySearch());

function handleCitySearch() {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
        cityInput.value = ''; // Clear input after search
    }
}

function fetchWeather(city) {
    clearDisplay(); // Clear previous data
    spinner.style.display = "block"; // Show spinner

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            spinner.style.display = "none"; // Hide spinner
            updateWeather(data);
        })
        .catch(() => {
            spinner.style.display = "none"; // Hide spinner on error
            showError("Could not retrieve weather information. Please try again.");
        });
}

function updateWeather(data) {
    const { main, weather, name, wind } = data;
    const weatherCondition = weather[0].main.toLowerCase();

    // Update weather information
    tempValue.innerHTML = `${Math.round(main.temp)}°C`;
    weatherDescription.innerHTML = weather[0].description;
    locationDisplay.innerHTML = name;
    feelsLike.innerHTML = `${Math.round(main.feels_like)}°C`;
    humidity.innerHTML = `${main.humidity}%`;
    windSpeed.innerHTML = `${wind.speed} m/s`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    weatherDisplay.style.display = "block"; // Show weather display

    // Apply weather theme based on condition
    applyWeatherTheme(weatherCondition);
}

function applyWeatherTheme(condition) {
    // Remove previous weather classes
    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'thunderstorm');

    if (condition.includes("clear")) {
        document.body.classList.add('sunny');
    } else if (condition.includes("clouds")) {
        document.body.classList.add('cloudy');
    } else if (condition.includes("rain")) {
        document.body.classList.add('rainy');
    } else if (condition.includes("snow")) {
        document.body.classList.add('snowy');
    } else if (condition.includes("thunderstorm")) {
        document.body.classList.add('thunderstorm');
    }
}

function showError(message) {
    errorDisplay.innerHTML = message;
    errorDisplay.style.display = "block"; // Show error message
    weatherDisplay.style.display = "none"; // Hide weather display
    setTimeout(() => {
        errorDisplay.style.display = "none"; // Hide error message after 3 seconds
    }, 3000);
}

function clearDisplay() {
    tempValue.innerHTML = '';
    weatherDescription.innerHTML = '';
    locationDisplay.innerHTML = '';
    feelsLike.innerHTML = '';
    humidity.innerHTML = '';
    windSpeed.innerHTML = '';
    weatherDisplay.style.display = "none"; // Hide weather display
}

// Load weather effect container on page load
window.onload = function () {
    weatherEffectContainer = document.createElement('div');
    weatherEffectContainer.className = 'weather-effect';
    document.body.appendChild(weatherEffectContainer);
};
