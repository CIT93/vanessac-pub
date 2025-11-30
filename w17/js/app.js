// Calculate points, displays results, AND stores entries in an in-memory array.
// Display the calculated results for the current entry on the page.

console.log("Hello from app.js! Your JavaScript is connected and running!");

import {initFormListeners, getFormInputs, clearForm, populateFormForEdit} from "./form-handler.js";
import {calculateHobby} from "./decision.js";
import {displayResults, hideResults, clearCompareDisplay, updateCompareDisplay} from "./ui.js";
import {saveEntries, generateUniqueId, loadEntries, clearAllEntries, getEntriesByIds} from "./data-store.js";
import {renderTable} from "./table-renderer.js";
import {checkHobbyAndLoadAQI} from "./aqi-integrator.js";
import {checkHobbyAndLoadWeather} from "./weather-integrator.js";

// Declare a 'const' array to hold all submitted hobby entries in memory.
// 'Const' is used because the 'hobbyEntries' variable will always refer to the same array, even if its contents will change (items added).
const hobbyEntries = [];    // Empty Array Literal = Global Variable
const compareEntryIds = [];     // Hold IDs of selected entries to compare
const hobbyForm = document.getElementById("hobbyForm");     //References the main hobby form.
const clearFormButton = document.getElementById("clearFormButton");     // References the clear form button.
const clearAllDataButton = document.getElementById("clearAllDataButton");     // Get reference to Clear All Data button  
const submitButton = document.getElementById("submitButton");
const resultsSection = document.getElementById("results");
const resetCompareButton = document.getElementById("resetCompareButton");

const hobbyDropdownError = hobbyForm.querySelector("#hobbyDropdownError");
const timeError = hobbyForm.querySelector("#timeError");
const fundingError = hobbyForm.querySelector("#fundingError");
const socialError = hobbyForm.querySelector("#socialError");
const dedicationError = hobbyForm.querySelector("#dedicationError");

// State variables for in-line confirmation of "Clear All Data" button.
let isConfirmingClearAll = false;       // Tracks if the button is in a "confirming" state.
let clearAllTimeoutId = null;       // Stores the ID returned by setTimeout, so it can be cancelled.

const handleCompareEntry = (id) => {
    const index = compareEntryIds.indexOf(id);      // Checks if ID is already selected

    if (index !== -1) {
        compareEntryIds.splice(index, 1);   // If selected before, it deselects 
        console.log(`Deselected entry with ID: ${id}`);
    } else if (compareEntryIds.length < 2) {  
        compareEntryIds.push(id);       // Adds new ID if < 2 are selected
        console.log(`Selected entry with ID: ${id} for comparison.`);
    } else {
        compareEntryIds.shift ();       // Removes first element
        compareEntryIds.push(id);    // Adds new element
        console.log(`Comparison full. Replaced oldest selection with ID: ${id}`);    
    }

    const entriesToCompare = getEntriesByIds(hobbyEntries, compareEntryIds);      // Functional code corrected by Gemini
    updateCompareDisplay(entriesToCompare);

    renderTable(hobbyEntries, {     //Re-renders table to remove active compare states
        onDelete: handleDeleteEntry,
        onEdit: handleEditEntry,
        onCompare: handleCompareEntry,      
        compareIds: compareEntryIds
    });
}
    
const handleResetCompare = () => {
    compareEntryIds.length = 0;     // Clears array
    clearCompareDisplay();
    renderTable(hobbyEntries, {     //Re-renders table to remove active compare states
        onDelete: handleDeleteEntry,
        onEdit: handleEditEntry,
        onCompare: handleCompareEntry,
        compareIds: compareEntryIds
    });
    console.log("Compare Selection Cleared.");
}

const resetClearAllButton = () => {        // Resets the "Clear All Data" button to its original text and appearance.
    if(clearAllTimeoutId) {
        clearTimeout(clearAllTimeoutId);    // If a timeout is active (meaning the button is in a confirming state), clear it.
        console.log(`Cleared timeout ID: ${clearAllTimeoutId}`);
        clearAllTimeoutId = null;   
    }

    isConfirmingClearAll = false;    // Reset the confirmation state
    clearAllDataButton.classList.remove("confirm-state");
    clearAllDataButton.textContent = "Clear All Saved Data";    // Restore original button text and remove any special styling class.
} 

const resetSubmitButtonToDefault = () => {
    submitButton.textContent = "Submit";
    submitButton.classList.remove("update-mode");
};

const resetAllUIStates = () => {
    clearErrorMessages();
    resetClearAllButton();
}
const clearErrorMessages = (event) => {
	hobbyDropdownError.textContent = "";
	hobbyDropdownError.style.display = "none"
	
	timeError.textContent = "";
	timeError.style.display = "none";

	fundingError.textContent = "";
	fundingError.style.display = "none";

	socialError.textContent = "";
	socialError.style.display = "none";

	dedicationError.textContent = "";
	dedicationError.style.display = "none";
}

const validateForm = (formData) => {
    clearErrorMessages();
	let isValid = true;

	// Rule 1: A hobby must be selected
	if(!formData.selectedHobby || formData.selectedHobby === "Select") {        // Corrected by Gemini
		hobbyDropdownError.textContent = "A hobby must be selected!";
		hobbyDropdownError.style.display = "block";
		isValid = false;
	}
	// Rule 2: Available time must be positive or select “No time available”
	if (formData.time < 0 && !formData.noTimeAvailable) {
		timeError.textContent = 'Time must be a positive number, or check “No Time Available”';
		timeError.style.display = "block"; 
		isValid = false;
    }
    // Rule 3: Funding level must be positive
    if (formData.funding < 0) {
        fundingError.textContent = "Funding must be positive!";
        fundingError.style.display = "block";
        isValid = false;
    }
    // Rule 4: A social level must be selected
    if (!formData.social) {
	    socialError.textContent = "A social level must be selected";
	    socialError.style.display = "block";
	    isValid = false;
    }
    // Rule 5: A dedication level must be selected
	if (!formData.dedication) {
		dedicationError.textContent = "A dedication level must be selected";
		dedicationError.style.display = "block";
		isValid = false;
    }
    
    return isValid;
}

const handleFormSubmit = (event) => {      // Handles the Form submission event, preventing default page reload.
    event.preventDefault();
    const formData = getFormInputs();

    if (!validateForm(formData)) {     
        console.log("Form validation failed. Stopping submission.");
        return;     // Stops execution if validation fails
    }
    console.log("Form validation passed. Proceeding with submission.");

    const calculatedResults = calculateHobby(formData);   // Add a timestamp for when this entry was created.

    let entryToSave = {
      ...formData,      // spread operator “…” quickly copies all properties from formData
      ...calculatedResults,
    };

    if(entryToSave.id) {       // Correctly checks for ID in the new entry object
        const index = hobbyEntries.findIndex(entry => {
            return entry.id === entryToSave.id;        
        });

        if(index !== -1) {
            entryToSave.timestamp = hobbyEntries[index].timestamp;
            hobbyEntries[index] = entryToSave;
            console.log(`Updated entry with id ${entryToSave.id} and replaced old entry`);
        } else {
            console.warn(`Attempted to update entry with id ${entryToSave.id}, but it was not found, adding as new`);
            entryToSave.id = generateUniqueId();
            entryToSave.timestamp = new Date().toISOString();
            hobbyEntries.push(entryToSave);
            // Fallback: If not found, add as new.
        }
    } else {
        entryToSave.id = generateUniqueId();        // CREATE operation is null(new entry) because of formData.id (new entry).
        entryToSave.timestamp = new Date().toISOString();
        hobbyEntries.push(entryToSave);
        console.log("Created new entry."); 
    }

    console.log("Current Entries:", hobbyEntries);    // Logs the full array!
    saveEntries(hobbyEntries);
    displayResults(entryToSave);
    checkHobbyAndLoadAQI(entryToSave.selectedHobby);
    checkHobbyAndLoadWeather(entryToSave.selectedHobby);
    renderTable(hobbyEntries, {
        onDelete: handleDeleteEntry,
        onEdit: handleEditEntry,  
        onCompare: handleCompareEntry,
        compareIds: compareEntryIds
    });

    const entriesToCompare = getEntriesByIds(hobbyEntries, compareEntryIds);      // Corrected by Gemini
    updateCompareDisplay(entriesToCompare);

    if (resultsSection) {
        resultsSection.scrollIntoView({
            behavior: "smooth",     //Makes sure school transition is smooth

        });
    }

    clearForm();    // Clears the form input and hides the results section
    resetSubmitButtonToDefault();
    resetAllUIStates();
}

const performClearAllData = () => {       // New function to perform the actual clearing of all saved data.
    console.log("Clearing in-memory array and localStorage.")
    hobbyEntries.length = 0;
    clearAllEntries ();
    renderTable(hobbyEntries, {       // Re-render table (will show "No entries")
        onDelete: handleDeleteEntry,
        onEdit: handleEditEntry,
        onCompare: handleCompareEntry,
        compareIds: compareEntryIds
    });      
    clearForm();       // Clear the form inputs
    hideResults();    // Hide the results section
    clearCompareDisplay();
    resetAllUIStates();
    }

const handleClearForm = () => {        // Handles the Clear Form button click, resetting form fields.
    clearForm();
    clearErrorMessages();
    hideResults();
    console.log("Clear button clicked");
    resetSubmitButtonToDefault();
    resetAllUIStates();

    compareEntryIds.length = 0;
    clearCompareDisplay();

renderTable(hobbyEntries, {       // Re-render table (will show "No entries")
        onDelete: handleDeleteEntry,
        onEdit: handleEditEntry,
        onCompare: handleCompareEntry,
        compareIds: compareEntryIds
});
console.log("Comparison Selection cleared during form clear.");
}

const handleDeleteEntry = (id) => {        // Handles the "Delete" action for a specific entry.
    console.log(`Delete button clicked for ID: ${id}`);
    const indexToDelete = hobbyEntries.findIndex(entry => {
         return entry.id === id;
    });

   if (indexToDelete !== -1) {
    const compareIndex = compareEntryIds.indexOf(id);
    if (compareIndex !== -1) {
        compareEntryIds.splice(compareIndex, 1);
    }
   
    hobbyEntries.splice(indexToDelete, 1);
    console.log("Entry removed from memory, Current Entries:", hobbyEntries);
    saveEntries(hobbyEntries);
    renderTable(hobbyEntries, {
        onEdit: handleEditEntry,
        onDelete: handleDeleteEntry,
        onCompare: handleCompareEntry,
        compareIds: compareEntryIds
    });

    const entriesToCompare = getEntriesByIds(hobbyEntries, compareEntryIds);      // Corrected by Gemini
    updateCompareDisplay(entriesToCompare);

    if(hobbyEntries.length === 0) {
        hideResults();
        clearForm();
    }
    resetAllUIStates();
    } else {
        console.warn(`Entry with ID ${id} not found for deletion`);
        resetAllUIStates();
    }
};

const handleEditEntry = (id) => {      // Handles the "Edit" action for a specific entry.
    console.log(`Edit button clicked for ID: ${id}`);
    const entryToEdit = hobbyEntries.find(entry => {        //Finds the entry object in in-memory array by using its ID.
        return entry.id === id;
      })
        if(entryToEdit) {
            populateFormForEdit(entryToEdit);     // Populates the form with the data from the found entry.
            window.scrollTo({top: 0, behavior: "smooth"});      // Scroll window to edit
            console.log(`Editing entry id ${id} form populated`);

            submitButton.textContent = "Update";
            submitButton.classList.add("update-mode");
        }
}

// Initializes the application by setting up event listeners and loading existing data.
const init = () => {
    console.log('App initialized: DOM is ready! Try submitting the form or clearing it.');
   
    hobbyForm.addEventListener("submit", handleFormSubmit);
    clearFormButton.addEventListener("click", handleClearForm);
    resetCompareButton.addEventListener("click", handleResetCompare);
    initFormListeners();

    const loadedEntries = loadEntries();      // Attempts to load any previously saved entries from localStorage on startup
    if (loadedEntries.length > 0) {         // If no data is found in localStorage, return an empty array.  
        hobbyEntries.push(...loadedEntries);           // hobbyEntries array using the spread operator (...).
        console.log("Entries loaded from localStorage");
    } else {
      console.log("No entries found in localStorage. Starting fresh.");
    }

    renderTable(hobbyEntries, {
        onDelete: handleDeleteEntry,
        onEdit: handleEditEntry,
        onCompare: handleCompareEntry,
        compareIds: compareEntryIds
    });

    clearAllDataButton.addEventListener("click", (event) => {       // Init function - Event listener for "Clear All Data"
        event.stopPropagation();        // Prevents this click from potentially triggering other global click listeners.
        if (isConfirmingClearAll) {     // User confirms, so perform the action on second click
            performClearAllData();   // resets state after action
        } else {
           isConfirmingClearAll = true;      // Asks for confirmation by changing button text and state on first click

        clearAllDataButton.textContent = "Click Again to Clear";
        clearAllDataButton.classList.add("confirm-state");         // Add a class to change its appearance (defined in style.css).
        clearAllTimeoutId = setTimeout(() => {             // Sets a timeout to automatically revert the button state if the user doesn't click again.
            resetClearAllButton();
            console.log("Clear All confirmation timed out");
           }, 2750);    // 2.75 seconds
        }
    });

    document.addEventListener("click", (event) => {        // Global click listener to reset the "Clear All Data" button state
        const isTargetInsideForm = hobbyForm.contains(event.target);

        if(isConfirmingClearAll && event.target !== clearAllDataButton && !isTargetInsideForm) {
            resetClearAllButton();
            console.log("Clear All confirmation reset by external click.");
        }
    });
}

// the DOM is fully loaded before running the script.
document.addEventListener("DOMContentLoaded", init);        // Attaches the initialization function to the DOMContentLoaded event.
