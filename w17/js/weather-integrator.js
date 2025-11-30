import {getUserLocation} from "./location-services.js";
import {fetchWeatherData} from "./weather-data-service.js";        

const Hobbies_Requiring_Weather = ["Camping/Hiking", "Exercise/Sports", "Fishing", "Gardening", "Traveling"];      

// --- DOM Element References ---
const weatherDisplaySection = document.getElementById('weather-display');           //Corrected by Gemini
const weatherLocationSpan = weatherDisplaySection?.querySelector("#weatherLocation");
const currentWeatherValueSpan = weatherDisplaySection?.querySelector('#currentWeatherValue');
const weatherDateSpan = weatherDisplaySection?.querySelector('#weatherDate');
const weatherStatusMessage = weatherDisplaySection?.querySelector('#weatherStatusMessage');
const refreshWeatherButton = weatherDisplaySection?.querySelector('#refreshWeatherButton');

const weatherIcon = weatherDisplaySection?.querySelector("#weatherIcon");
const detailDescriptionSpan = weatherDisplaySection?.querySelector("#detailDescription");
const tempFeelsLikeSpan = weatherDisplaySection?.querySelector("#tempFeelsLike");
const tempMinMaxSpan = weatherDisplaySection?.querySelector("#tempMinMax");
const humiditySpan = weatherDisplaySection?.querySelector("#humidity");
const pressureSpan = weatherDisplaySection?.querySelector("#pressure");
const windSpeedSpan = weatherDisplaySection?.querySelector("#windSpeed");
const windDirectionSpan = weatherDisplaySection?.querySelector("#windDirection");
const visibilitySpan = weatherDisplaySection?.querySelector("#visibility");
const sunriseSpan = weatherDisplaySection?.querySelector("#sunrise");
const sunsetSpan = weatherDisplaySection?.querySelector("#sunset");

const formatTime = (unixTimestamp, timezoneOffsetSeconds) => {      // Corrected by Gemini
    const utcTime = new Date(unixTimestamp * 1000);
    
    const localTimeMs = utcTime.getTime() + (timezoneOffsetSeconds * 1000);
    const localTime = new Date(localTimeMs);

    return localTime.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit", timeZone: "UTC"});
};

const degToCompass = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.floor((deg + 22.5) / 45) % 8;
    return directions[index];
};

const renderWeatherDisplay = (weatherData) => {
    const temp = Math.round(weatherData.main.temp);     
    const description = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    const city = weatherData.name;
    const feelsLike = Math.round(weatherData.main.feels_like);
    const tempMin = Math.round(weatherData.main.temp_min);
    const tempMax = Math.round(weatherData.main.temp_max);
    const humidity = weatherData.main.humidity;
    const pressureHPa = weatherData.main.pressure;
    const pressureInHg = (pressureHPa * 0.02953).toFixed(2);
    const visibilityMiles = (weatherData.visibility * 0.000621371).toFixed(1);
    const windSpeed = weatherData.wind.speed.toFixed(1);
    const windDeg = weatherData.wind.deg;
    const sunrise = formatTime(weatherData.sys.sunrise, weatherData.timezone);
    const sunset = formatTime(weatherData.sys.sunset, weatherData.timezone);

    if (currentWeatherValueSpan) currentWeatherValueSpan.textContent = `${temp}°F, ${description}`;     // Corrected by Gemini
    if (weatherLocationSpan) weatherLocationSpan.textContent = `${city}`;
    if (weatherStatusMessage) weatherStatusMessage.textContent = "Data loaded successfully.";

    if (weatherIcon) weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    if (weatherIcon) weatherIcon.alt = description;
    if (detailDescriptionSpan) detailDescriptionSpan.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    if (tempFeelsLikeSpan) tempFeelsLikeSpan.textContent = `${feelsLike}°F`;
    if (tempMinMaxSpan) tempMinMaxSpan.textContent = `${tempMax}°F / ${tempMin}°F`;
    if (humiditySpan) humiditySpan.textContent = `${humidity}%`;
    if (pressureSpan) pressureSpan.textContent = `${pressureInHg} inHg`;
    if (visibilitySpan) visibilitySpan.textContent = `${visibilityMiles} mi`;
    if (windSpeedSpan) windSpeedSpan.textContent = `${windSpeed} mph`;
    if (windDirectionSpan) windDirectionSpan.textContent = `${degToCompass(windDeg)} (${windDeg}°)`
    if (sunriseSpan) sunriseSpan.textContent = sunrise;
    if (sunsetSpan) sunsetSpan.textContent = sunset;

    if (weatherDisplaySection) weatherDisplaySection.style.display = "block";
};

// --- The Main Orchestration Function ---

export const checkHobbyAndLoadWeather = async (selectedHobby) => {         
    console.log(`Checking hobby: ${selectedHobby}`);
    
    if (!Hobbies_Requiring_Weather.includes(selectedHobby)) {
        if (weatherDisplaySection) weatherDisplaySection.style.display = "none";
        console.log("Hobby does not require weather data. Skipping fetch.");
        return;
    }
    
    if (currentWeatherValueSpan) currentWeatherValueSpan.textContent = '...';
    if (weatherStatusMessage) weatherStatusMessage.textContent = "Attempting to get your location...";
    if (weatherLocationSpan) weatherLocationSpan.textContent = '...';
    if (weatherDateSpan) weatherDateSpan.textContent = new Date().toLocaleTimeString(); 
    if (weatherStatusMessage) weatherStatusMessage.style.color = 'black'; // Set color for loading state
    if (weatherDisplaySection) weatherDisplaySection.style.display = 'block';
 
    if (detailDescriptionSpan) detailDescriptionSpan.textContent = '--';
    if (tempFeelsLikeSpan) tempFeelsLikeSpan.textContent = '--';
    if (tempMinMaxSpan) tempMinMaxSpan.textContent = '--';
    if (humiditySpan) humiditySpan.textContent = '--';
    if (pressureSpan) pressureSpan.textContent = '--';
    if (visibilitySpan) visibilitySpan.textContent = '--';
    if (windSpeedSpan) windSpeedSpan.textContent = '--';
    if (windDirectionSpan) windDirectionSpan.textContent = '--';
    if (sunriseSpan) sunriseSpan.textContent = '--';
    if (sunsetSpan) sunsetSpan.textContent = '--';
    if (weatherIcon) weatherIcon.src = '';
    if (weatherIcon) weatherIcon.alt = 'Loading...';

    try {
        const {latitude, longitude} = await getUserLocation();
        // Update status to indicate data fetching
        if (weatherStatusMessage) weatherStatusMessage.textContent = `Location found. Fetching Weather...`;
        if (weatherLocationSpan) weatherLocationSpan.textContent = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        // call the imported fetchWeatherData function and await its results
        const weatherData = await fetchWeatherData(latitude, longitude);       // declare a variable weatherData and determine where to call the fetchWeatherData and pass the latitude and longitude as arguments and await its result.
        console.log(weatherData);       
        renderWeatherDisplay(weatherData);

    } catch (error) {
        // Reset/Display Error State
        if (currentWeatherValueSpan) currentWeatherValueSpan.textContent = '--';
        if (weatherLocationSpan) weatherLocationSpan.textContent = 'N/A';
        if (weatherDateSpan) weatherDateSpan.textContent = new Date().toLocaleTimeString();
        if (weatherStatusMessage) weatherStatusMessage.style.color = 'red';
        if (weatherStatusMessage) weatherStatusMessage.textContent = `Error: ${error.message}`;
        if (weatherDisplaySection) weatherDisplaySection.style.display = 'block';
    }
};

    if (refreshWeatherButton) {
        refreshWeatherButton.addEventListener("click", () => {
            checkHobbyAndLoadWeather("Camping/Hiking");
            console.log("Weather Refresh initiated with default hobby 'Camping/Hiking'.");
        });
    }
