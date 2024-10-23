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
const historyList = document.getElementById('historyList');

let searchHistory = [];

// Fetch weather based on city when search button is clicked
searchBtn.addEventListener('click', function () {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
        updateSearchHistory(city);
    }
});

// Fetch weather when the enter key is pressed in the input field
cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        if (city) {
            fetchWeather(city);
            updateSearchHistory(city);
        }
    }
});

// Fetch weather when a city from search history is clicked
historyList.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        const city = e.target.textContent;
        fetchWeather(city);
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

// Update search history in the list and localStorage
function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        renderSearchHistory();
        saveSearchHistory();
    }
}

// Render search history in the list
function renderSearchHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = city;
        historyList.appendChild(li);
    });
}

// Save search history to localStorage
function saveSearchHistory() {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
}

// Load search history from localStorage on page load
function loadSearchHistory() {
    const savedHistory = localStorage.getItem('weatherSearchHistory');
    if (savedHistory) {
        searchHistory = JSON.parse(savedHistory);
        renderSearchHistory();
    }
}

// Load search history when the page loads
window.onload = loadSearchHistory;
