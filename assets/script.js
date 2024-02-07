/*curent application is not finished
while it does meet the requirements, 
There are some extra "seasonings" I'd
like to add later.*/

/*On page load hide recently searched,
 when displaying recently searched only
 display the 5 most recently searched*/

/*not relevant to js, but display your 
5-day in smaller bars stacked vertically,
with the current weather displayed on the 
left, and the 5-day on the right*/


// definitions
const apiKey = "f13fb3a09467cb3722772650c8c4d934";
const mydoc = document;
const form = mydoc.getElementById("city-form");
const cityInput = mydoc.getElementById("city-input");
const searchHistory = mydoc.getElementById("search-history");
const currentWeather = mydoc.getElementById("current-weather");
const forecast = mydoc.getElementById("forecast");


//"all your base are belong to us"- some guy on "Zero Wing."

// event listener to the form for submitting city search
form.addEventListener("submit", handleFormSubmit);

// fetch weather data from API based on city
async function getWeather(city) {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        // Fetch current weather and forecast data 
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherURL),
            fetch(forecastURL)
        ]);
        
        // Check if both responses are successful
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("City not found!");
        }

        // parse JSON data from responses
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Update current weather forecast and search history
        updateCurrentWeather(currentData);
        updateForecast(forecastData);
        updateSearchHistory(city);
    } catch (error) {
        // Handle errors in fetching data
        console.error("Error fetching weather data:", error);
        alert("City not found! Please try again.");
    }
}

// update the current weather display
function updateCurrentWeather(weatherData) {
    const { name, main, weather, wind } = weatherData;
    const icon = weather[0].icon;

    
    // update html content with current weather information
    currentWeather.innerHTML = `
        <div class="weather-info">
            <h2>${name}</h2>
            <p>${new Date().toDateString()}</p>
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        </div>
    `;
}
// update the forecast display
function updateForecast(forecastData) {
    const forecastList = forecastData.list.filter((item) => item.dt_txt.includes("12:00:00"));
    
    // Update html content with 5-day forecast 
    forecast.innerHTML = forecastList.map((item) => `
        <div class="weather-info">
            <p>${new Date(item.dt * 1000).toDateString()}</p>
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon">
            <p>Temperature: ${item.main.temp}°C</p>
            <p>Humidity: ${item.main.humidity}%</p>
            <p>Wind Speed: ${item.wind.speed} m/s</p>
        </div>
    `).join("");
}
// update the search history.
function updateSearchHistory(city) {
    const listItem = mydoc.createElement("li");
    listItem.textContent = city;
    listItem.addEventListener("click", () => getWeather(city));
    searchHistory.appendChild(listItem);
    
    // Show search history (not fully implemented: limit to 5 most recent)
    searchHistory.classList.remove("hidden");
}
// Function to handle the search input from user
function handleFormSubmit(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = "";
    }
}