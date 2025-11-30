import {checkHobbyAndLoadAQI} from "./aqi-integrator.js";
import {checkHobbyAndLoadWeather} from "./weather-integrator.js";


// This module handles getting input values from the form and clearing it (focuses on Hobby Selection input).
const hobbyForm = document.getElementById("hobbyForm");   // References main form
const hobbyInput = document.getElementById("selectedHobby");  // References the input field for the selected hobby.
const dropdownButton = document.querySelector(".dropbutton");   // References the dropdown button
const entryIdInput = document.getElementById("entryId");

const noTimeAvailableCheckbox = document.getElementById("noTimeAvailable");     // Geminis Suggestion
const timeInput = document.getElementById("Time");
const timeMessageDisplay = document.getElementById("timeMessageDisplay");
const noTimeLabelElement = hobbyForm.querySelector('label[for="noTimeAvailable"]');

const updateTimeInputState = () => {
  const message = "Then why are you here? Free up time and come back.";

  if (noTimeAvailableCheckbox.checked) {
    if (noTimeLabelElement) {
      noTimeLabelElement.style.display = "none";
    }
   
    timeMessageDisplay.textContent = message;
    timeMessageDisplay.style.display = "inline";

    timeInput.disabled = true;
    timeInput.value = 0;
  } else {
    if (noTimeLabelElement) {
        noTimeLabelElement.style.display = "inline";
    }

    timeMessageDisplay.textContent = "";
    timeMessageDisplay.style.display = "none";

    timeInput.disabled = false;
    timeInput.value = 1;
  }
};

export const initFormListeners = () => {
  if (noTimeAvailableCheckbox && timeInput && timeMessageDisplay) {
      noTimeAvailableCheckbox.addEventListener("change", updateTimeInputState);
  }
  updateTimeInputState();
};

const dropdownContent = document.querySelector(".dropdown-content");
  dropdownButton.addEventListener("click", (event) => {  // Dropdown opens and closes when button is clicked
    event.preventDefault(); 
    dropdownContent.classList.toggle("show");
  });

dropdownContent.addEventListener("click", (event) => { 
  if (event.target.tagName === "A") {
    event.preventDefault();
    const selectedHobby = event.target.textContent;
    dropdownButton.textContent = selectedHobby;
    hobbyInput.value = selectedHobby;
    dropdownContent.classList.remove("show");
  
    checkHobbyAndLoadAQI(selectedHobby);
    checkHobbyAndLoadWeather(selectedHobby);
  }
});

document.addEventListener ("click", (event) => {   // Closes dropdown menu if clicked outside of it
    if (!event.target.closest('.dropbutton')) {
       const openDropdown = document.querySelector(".dropdown-content.show");
          if (openDropdown) {
                openDropdown.classList.remove('show');
          }
    }
});

// Retrieves selected button from radio element Nodelist
const getSelectedRadioValue = (radioButtons) => {   // “value” attribute of the selected radio button.
   for (const radio of radioButtons) {
    if (radio.checked) {
        return radio.value;
       }
   } 
   return null;
};

export const getFormInputs = () => {    // Collects relevant input values 
  return {    
    id: entryIdInput ? entryIdInput.value : null,
    selectedHobby: hobbyInput.value,
    time: parseInt(hobbyForm.querySelector("#Time").value) || 0,
    noTimeAvailable: hobbyForm.querySelector("#noTimeAvailable").checked,
    funding: parseInt(hobbyForm.querySelector("#Funding").value) || 0,
    social: getSelectedRadioValue(hobbyForm.querySelectorAll("input[name='Social']")),
    dedication: getSelectedRadioValue(hobbyForm.querySelectorAll("input[name='Dedication']"))
      };
};

export const clearForm = () => {    // Clears input fields and resets default selections
    hobbyForm.reset();
    dropdownButton.textContent = "Select";
    hobbyInput.value = "";
    document.getElementById("Time").value = 1;
    document.getElementById("Funding").value = 1;
    if (entryIdInput) {
       entryIdInput.value = "";
    }
    updateTimeInputState();
    checkHobbyAndLoadAQI("");
    checkHobbyAndLoadWeather("");
};

export const populateFormForEdit = (entry) => {
  if (entryIdInput) {
    entryIdInput.value = entry.id;
  }
  hobbyInput.value = entry.selectedHobby;
  dropdownButton.textContent = entry.selectedHobby;
  document.getElementById("Time").value = entry.time;
  document.getElementById("Funding").value = entry.funding;

  const noTimeCheckbox = document.getElementById("noTimeAvailable");
  if (noTimeCheckbox) noTimeCheckbox.checked = entry.noTimeAvailable;
  
  const socialRadio = hobbyForm.querySelector(`input[name="Social"][value="${entry.social}"]`)
  if (socialRadio) socialRadio.checked = true;
  
  const dedicationRadio = hobbyForm.querySelector(`input[name="Dedication"][value="${entry.dedication}"]`)
  if (dedicationRadio) dedicationRadio.checked = true;
  updateTimeInputState();

  checkHobbyAndLoadAQI(entry.selectedHobby);
  checkHobbyAndLoadWeather(entry.selectedHobby);
};
