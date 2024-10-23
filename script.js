const apiKey = 'befd984de4d3c050671d4eb935e6c660';
const cityInput = document.getElementById('cityInput');
const getLocationBtn = document.getElementById('getLocationBtn');
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

// Fetch weather based on city
cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

// Fetch weather using device location
getLocationBtn.addEventListener('click', function () {
    if (navigator.geolocation) {
        spinner.style.display = "block"; // Show spinner while fetching location
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
        }, (error) => {
            // Handle geolocation errors
            showError(`Geolocation error: ${error.message}`);
        });
    } else {
        showError("Geolocation is not supported by this browser.");
    }
});

function fetchWeather(city) {
    spinner.style.display = "block"; // Show spinner while fetching data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            spinner.style.display = "none"; // Hide spinner after fetching data
            updateWeather(data);
        })
        .catch(err => {
            spinner.style.display = "none"; // Hide spinner on error
            showError("Could not retrieve weather information. Please try again.");
        });
}

function fetchWeatherByLocation(lat, lon) {
    spinner.style.display = "block"; // Show spinner while fetching data
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            spinner.style.display = "none"; // Hide spinner after fetching data
            updateWeather(data);
        })
        .catch(err => {
            spinner.style.display = "none"; // Hide spinner on error
            showError("Could not retrieve weather information. Please try again.");
        });
}

function updateWeather(data) {
    const { main, weather, name, wind } = data;
    tempValue.innerHTML = `${Math.round(main.temp)}°C`;
    weatherDescription.innerHTML = weather[0].description;
    locationDisplay.innerHTML = name;
    feelsLike.innerHTML = `${Math.round(main.feels_like)}°C`;
    humidity.innerHTML = `${main.humidity}%`;
    windSpeed.innerHTML = `${wind.speed} m/s`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    weatherDisplay.style.display = "block"; // Show weather display after data is fetched
}

function showError(message) {
    errorDisplay.innerHTML = message;
    errorDisplay.style.display = "block"; // Show error message
    weatherDisplay.style.display = "none"; // Hide weather display on error
    setTimeout(() => {
        errorDisplay.style.display = "none"; // Hide error message after 3 seconds
    }, 3000);
}
