// aqi-integrator.js
// RESPONSIBILITY: UI Orchestration, Error Handling, and Rendering.
import {getUserLocation} from "./location-services.js";
import {fetchAQIData} from "./aqi-data-service.js";        // Corrected by Dev Tools

const Hobbies_Requiring_AQI = ["Camping/Hiking", "Exercise/Sports", "Fishing", "Gardening", "Traveling"];       // Corrected by Gemini

// --- DOM Element References ---
// Get references to the HTML elements where we will display AQI information.
const aqiDisplaySection = document.getElementById('aqi-display');
const currentAqiValueSpan = aqiDisplaySection.querySelector('#currentAqiValue');
const aqiLocationSpan = aqiDisplaySection.querySelector('#aqiLocation');
const aqiDateSpan = aqiDisplaySection.querySelector('#aqiDate');
const aqiStatusMessage = aqiDisplaySection.querySelector('#aqiStatusMessage');
const refreshAqiButton = aqiDisplaySection.querySelector('#refreshAqiButton');

const getAqiQuality = (aqiIndex) => {
    switch (aqiIndex) {
        case 1: return { label: "Good", color: "text-green-600", description: "Air quality is considered satisfactory, and air pollution poses little or no risk." };
        case 2: return { label: "Fair", color: "text-yellow-600", description: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern." };
        case 3: return { label: "Moderate", color: "text-orange-600", description: "Members of sensitive groups may experience health effects." };
        case 4: return { label: "Poor", color: "text-red-600", description: "Health warnings of emergency conditions." };
        case 5: return { label: "Very Poor", color: "text-purple-600", description: "Health alert: everyone may experience more serious health effects." };
        default: return { label: "Unknown", color: "text-gray-500", description: "AQI data is currently unavailable." };
    }
};

// Takes API data and updates specific target HTML elements with the formatted AQI information.
// @param {Object} apiData - The JSON object returned by the AQI API fetch call.
const renderAQIDisplay = (aqiData) => {
    const aqiIndex = aqiData.list[0].main.aqi;
    const quality = getAqiQuality(aqiIndex);
    currentAqiValueSpan.textContent = `${aqiIndex} (${quality.label})`;
    currentAqiValueSpan.classList.add(quality.color, "font-extrabold");
    aqiStatusMessage.textContent = quality.description;

    aqiDisplaySection.style.display = "block";
};

// --- The Main Orchestration Function ---

export const checkHobbyAndLoadAQI = async (selectedHobby) => {          // Corrected by Gemini
    console.log(`Checking hobby: ${selectedHobby}`);
    
    if (!Hobbies_Requiring_AQI.includes(selectedHobby)) {
        aqiDisplaySection.style.display = "none";
        console.log("Hobby does not require AQI data. Skipping fetch.");
        return;
    }
    
    currentAqiValueSpan.textContent = '...';
    aqiStatusMessage.textContent = "Attempting to get your location...";
    aqiLocationSpan.textContent = '...';
    aqiDateSpan.textContent = new Date().toLocaleTimeString(); 
    aqiStatusMessage.style.color = 'black'; // Set color for loading state
    aqiDisplaySection.style.display = 'block';
 
    try {
        // Get user location using the imported service function.
        // NOTE: The await keyword pauses execution *within this async function*.
        const {latitude, longitude} = await getUserLocation();
        // Update status to indicate data fetching
        aqiStatusMessage.textContent = `Location found. Fetching AQI...`;
        aqiLocationSpan.textContent = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        // call the imported fetchAqiData function and await its results
        const aqiData = await fetchAQIData(latitude, longitude);       // declare a variable aqiData and determine where to call the fetchAqiData and pass the latitude and longitude as arguments and await its result.
        console.log(aqiData);       
        renderAQIDisplay(aqiData);

    } catch (error) {
        // Reset/Display Error State
        currentAqiValueSpan.textContent = '--';
        aqiLocationSpan.textContent = 'N/A';
        aqiDateSpan.textContent = new Date().toLocaleTimeString();
        aqiStatusMessage.style.color = 'red';
        aqiStatusMessage.textContent = `${error.message}`;
        aqiDisplaySection.style.display = 'block';
    }
};

    if (refreshAqiButton) {
        refreshAqiButton.addEventListener("click", () => {
            checkHobbyAndLoadAQI("Camping/Hiking");
            console.log("AQI Refresh initiated with default hobby 'Camping/Hiking'.");
        });
    }
