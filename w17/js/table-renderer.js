// This module handles rendering the hobby entries table.

const hobbyTable = document.getElementById("hobbyTable");       // References the table, its body, and the "no entries" message.
const hobbyTableBody = hobbyTable.querySelector("tbody");       // References the tbody element within the table
const noEntriesMessage = document.getElementById("noEntriesMessage");       // References the message displayed when there are no entries 

let _currentCallbacks = {};     // Module-level variable to store the most recent callbacks.

// States variables for managing in-line row confirmation (for delete button)
let currentConfirmingRowElement = null;     // Stores the <td> element where confirmation is pending
let currentConfirmTimeoutId = null;     // Stores the setTimeout ID for the confirmation timmer

const clearAllDataButton = document.getElementById("clearAllDataButton");       //References the Clear All Data button

const resetRowConfirmationState = () => {
    if (currentConfirmTimeoutId) {
       clearTimeout(currentConfirmTimeoutId);
       currentConfirmTimeoutId = null;
       }
    if (currentConfirmingRowElement) {
        const confirmBtn = currentConfirmingRowElement.querySelector(".action-button.confirm");
        const cancelBtn = currentConfirmingRowElement.querySelector(".action-button.cancel");

        if (confirmBtn) confirmBtn.remove();
        if (cancelBtn) cancelBtn.remove();

        const editButton = currentConfirmingRowElement.querySelector(".action-button.edit");
        const deleteButton = currentConfirmingRowElement.querySelector(".action-button.delete");
        const compareButton = currentConfirmingRowElement.querySelector(".action-button.compare");

        if(editButton) editButton.style.display = "";       //Restores default display
        if(deleteButton) deleteButton.style.display = "";
        if(compareButton) compareButton.style.display = "";

        currentConfirmingRowElement = null;
    }
}
const showDeleteConfirmingButtons = (actionCell, id, onDeleteCallback) => {    // Shows "Confirm Delete" and "Cancel" buttons, hiding original action buttons.
    resetRowConfirmationState();
  
    const editButton = actionCell.querySelector(".action-button.edit");
    const deleteButton = actionCell.querySelector(".action-button.delete");
    const compareButton = actionCell.querySelector(".action-button.compare");

    if(editButton) editButton.style.display = "none";
    if(deleteButton) deleteButton.style.display = "none";
    if(compareButton) compareButton.style.display = "none";

    currentConfirmingRowElement = actionCell;
        
    const confirmBtn = document.createElement("button");     //Creates and append confirmation buttons
    confirmBtn.textContent = "Confirm Delete";
    confirmBtn.classList.add("action-button", "confirm");   //Add styling class
    confirmBtn.dataset.id = id;     // @param {string} id - The ID of the entry being acted upon.
     
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("action-button", "cancel");     //Add styling class
    cancelBtn.dataset.id = id;
     
    confirmBtn.addEventListener("click", (e) => {      // @param {Function} onDeleteCallback - The callback to execute if confirmed.
        e.stopPropagation();
        onDeleteCallback(id);
        resetRowConfirmationState();
    });

 cancelBtn.addEventListener("click", e => {
        e.stopImmediatePropagation();
        resetRowConfirmationState();
    });

    actionCell.appendChild(confirmBtn);     // @param {HTMLElement} actionCell - The element containing the buttons.
    actionCell.appendChild(cancelBtn)       // Updates table with new confirmation buttons

currentConfirmTimeoutId = setTimeout(() => {        // Sets up a timeout to revert if no action is taken.
        resetRowConfirmationState();
    }, 2750);
}

const formatRadioValue = (value) => {      // @param {string} value - The raw value from a radio button.
    switch(value) {
        case "Solo": return "Solo";
        case "Friends Only": return "Friends Only";
        case "Invite Everyone": return "Invite Everyone";
        case "Committed": return "Committed";
        case "Interested": return "Interested";
        case "Lost Cause": return "Lost Cause";
        default: return value       // @returns {string} The formatted display string.
    }
};

const formatDateForDisplay = (timestamp) => {    // @param {string} timestamp - ISO string timestamp.
    const date = new Date(timestamp);       // Formats a timestamp into a local date string.
    return date.toLocaleDateString('en-US', {       // @returns {string} Formatted date string.
        year: "numeric", month: "short", day: "numeric"
    });
}

const formatNumber = (num, unit) => {
    if (unit === "$") {
        return `${unit}${num}`;
}
    return `${num} ${unit}`;
};

const getCompareButtonText = (isComparing) => {        // Function correcte by Gemini
    return isComparing ? "Comparing..." : "Compare";
};

const createTableRow = (entry, compareIds = []) => {         // Creates and returns a single table row () element for a given entry.
    const row = document.createElement("tr");       // @param {Object} entry - The hobby entry object to display.
    const isComparing = compareIds.includes(entry.id);

    if (isComparing) {
        row.classList.add("compare-selected");
    }

    const compareButtonClass = isComparing ? "action-button compare active" : "action-button compare";      // Integrated with Google Search's help
    const compareButtonText = isComparing ? "Comparing..." : "Compare";

    // This is super useful for JavaScript to quickly find a row later for editing or deleting.
    row.dataset.id = entry.id;     // Store the entry's unique ID directly on the row using a data-id attribute.
   // Set the inner HTML of the row using a template literal.//
    row.innerHTML = `        
        <td>${formatDateForDisplay(entry.timestamp)}</td>
        <td>${entry.selectedHobby}</td>
        <td>${entry.timePoints}</td>
        <td>${entry.fundingPoints}</td>
        <td>${entry.socialPoints}</td>
        <td>${entry.dedicationPoints}</td>
        <td>${entry.totalHobby}</td>
        <td class="action-cell">
            <button class="action-button edit" data-id="${entry.id}">Edit</button>
            <button class="action-button delete" data-id="${entry.id}">Delete</button>
            <button class="${compareButtonClass}" data-id="${entry.id}">${compareButtonText}</button>
        </td>
    `;
    return row
};

export const renderTable = (entries, {compareIds = [], ...callbacks}) => {       // Main function to render the table with the given hobby entries.
    _currentCallbacks = callbacks;    // Stores callbacks passed to renderTable so handleTableClick can assess them
    hobbyTableBody.innerHTML = "";    // Sorting them and managing the visibility of the table and messages.

    if(entries.length === 0) {  
        hobbyTable.style.display = "none";
        noEntriesMessage.style.display = "block";
        clearAllDataButton.style.display = "none";     
        console.log("No entries to display. Table hidden");
        return; 
    } else {
        hobbyTable.style.display = "table";
        noEntriesMessage.style.display = "none";
        clearAllDataButton.style.display = "block";
    }

    // Spread operator [...] to creates a shallow copy so the original array order is not modified.
    const sortedEntries = [...entries].sort((a, b) => {       // Sorts entries by timestamp (most recent first) before rendering.
        return new Date(b.timestamp) - new Date(a.timestamp)    // Sorts the array in descending order (newest first)
    });

    for(const entry of sortedEntries) {
        const rowElement = createTableRow(entry, compareIds);     // Call our helper function to build the row
        hobbyTableBody.appendChild(rowElement);
    };
};
 
const handleTableClick = (event) => {       // This single listener handles clicks on all buttons (edit, delete, confirm, cancel) within the table body.
    const target = event.target;
    const id = target.dataset.id;
    const actionCell = target.closest("td");        // It's attached only once, even if renderTable is called multiple times.
    console.log(target);

    if (!target.classList.contains("action-button") || !id) {
        return;
    }

    if (target.classList.contains("compare") && typeof _currentCallbacks.onCompare === "function") {
        resetRowConfirmationState();
        _currentCallbacks.onCompare(id);
    }
    else if (target.classList.contains("delete") && typeof _currentCallbacks.onDelete === "function") {    //_currentCallbacks.onDelete(id);
        currentConfirmingRowElement = actionCell;
        showDeleteConfirmingButtons(actionCell, id, _currentCallbacks.onDelete);       // Check if the target has the 'delete' class AND if the onDelete callback is provided
    } else if (target.classList.contains("edit") && typeof _currentCallbacks.onEdit === "function"){
         resetRowConfirmationState();    // Clear any pending delete confirmation before editing
         _currentCallbacks.onEdit(id);   // Call the edit callback provided by app.js
    }
};
    
hobbyTableBody.addEventListener("click", handleTableClick);
