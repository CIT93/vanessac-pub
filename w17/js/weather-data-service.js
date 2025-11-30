import {WEATHER_API_Base_URL, WEATHER_API_KEY} from "./config.js";
console.log(WEATHER_API_Base_URL);

// Fetches the data from an external API based on latitude and longitude.
// @param {number} lat - Latitude.
// @param {number} lon - Longitude.
// @returns {Promise} A Promise that resolves with the parsed JSON data.
export const fetchWeatherData = async (lat, lon) => {           
    try {    
        const url = `${WEATHER_API_Base_URL}?lat=${lat}&lon=${lon}&units=imperial&appid=${WEATHER_API_KEY}`;      
        const response = await fetch(url);      
        if(!response.ok) {
            // Throw descriptive error if HTTP status is not successful (200 - 299)
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText || "Unknown API error"}`)
        }    
        const data = await response.json();
        return data;
} catch (error) {
    console.error("Error fetching Weather data:", error)
    throw new Error(`Failed to fetch Weather data: ${error.message}`);
    }  
}

    
