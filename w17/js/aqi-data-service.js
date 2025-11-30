// RESPONSIBILITY: Handle all asynchronous network and location operations (Promises, fetch, API Key).

import {AQI_API_Base_URL, AQI_API_KEY} from "./config.js";
console.log(AQI_API_Base_URL);

// Gets the user's current geographical location (latitude and longitude).
// @returns {Promise<{latitude: number, longitude: number}>} A Promise that resolves
// with coordinates or rejects with an Error if location cannot be obtained.

// Write the fetchAqiData function and add these comment above the function
// Fetches the AQI data from an external API based on latitude and longitude.
// @param {number} lat - Latitude.
// @param {number} lon - Longitude.
// @returns {Promise} A Promise that resolves with the parsed JSON data.
export const fetchAQIData = async (lat, lon) => {           // Corrected by dev Tools
    try {    
        const url = `${AQI_API_Base_URL}?lat=${lat}&lon=${lon}&appid=${AQI_API_KEY}`;        //Corrected by Dev Tools
        const response = await fetch(url);      // Corrected by Dev Tools
        if(!response.ok) {
            // Throw descriptive error if HTTP status is not successful (200 - 299)
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText || "Unknown API error"}`)
        }    
        const data = await response.json();
        return data;
} catch (error) {
    console.error("Error fetching AQI data:", error)
    throw new Error(`Failed to fetch AQI data: ${error.message}`);
    }  
}

    
