const apiKey = 'befd984de4d3c050671d4eb935e6c660'; // Replace with your weather API key
const cityInput = document.getElementById('cityInput');
const getLocationBtn = document.getElementById('getLocationBtn');
const tempValue = document.getElementById('tempValue');
const weatherDescription = document.getElementById('weatherDescription');
const locationDisplay = document.getElementById('location');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weatherIcon');

// Fetch weather based on city
cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

// Fetch weather using device location
getLocationBtn.addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => updateWeather(data))
        .catch(error => {
            alert("Could not retrieve weather information. Please try again.");
            console.error(error);  // Log error for debugging
        });
}

function fetchWeatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location weather not found');
            }
            return response.json();
        })
        .then(data => updateWeather(data))
        .catch(error => {
            alert("Could not retrieve weather information. Please try again.");
            console.error(error);  // Log error for debugging
        });
}

function updateWeather(data) {
    const { main, weather, name } = data;
    tempValue.innerHTML = `${Math.round(main.temp)}°C`;
    weatherDescription.innerHTML = weather[0].description;
    locationDisplay.innerHTML = name;
    feelsLike.innerHTML = `${Math.round(main.feels_like)}°C`;
    humidity.innerHTML = `${main.humidity}%`;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
}
