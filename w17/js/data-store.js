// This module handles all interactions with localStorage for hobby entries.

const LOCAL_STORAGE_KEY = "hobbyEntries";       // A unique key to identify data in localStorage.

export const saveEntries = (entries) => {      // Saves the given array of entries to localStorage (primary function)
   try {   // Try-Catch-Block - Error Checking
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));       // localStorage can only store strings. JavaScript array of objects must be converted into a JSON string using JSON.stringify() before saving.
        console.log("Data saved to localStorage successfully!");
    } catch (error) {
        console.error(`Error saving data to localStorage: ${error}`)
    };
};

export const generateUniqueId = () => {       // Generates a simple, unique ID for a new entry based on the current timestamp.
    return Date.now ().toString();      // @returns {string} A unique ID string.
};

export const loadEntries = () => {     // Loads all hobby entries from localStorage.
    try {
        const dataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (dataString) {
        return JSON.parse(dataString);           // If data exists, parse the JSON string back into a JavaScript array/object.
        }
        return[];             // If no data is found in localStorage, return an empty array.

     }  catch (e) {
        console.error(`Error loading entries from localStorage: ${e}`);        // Good practice to clear corrupted data to prevent continuous errors.
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return [];
     }
};

export const clearAllEntries = () => {     // Clears all data from localStorage.
   localStorage.removeItem(LOCAL_STORAGE_KEY);      //Removes the specific key used by app from localStorage.
   console.log("All entries clear from localStorage"); 
}

export const getEntriesByIds = (allEntries, ids) => {
       return ids.slice(0, 2)
       .map(id => allEntries.find(entry => entry.id === id)     // Looks for two entries
      
    ).filter(entry => entry !== undefined);         // Filters out undefined when ID isn't found
}

