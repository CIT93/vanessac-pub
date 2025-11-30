// This module contains the core logic for calculating hobby decision points.
// Calculate points for each category using dedicated helper functions
// It exports “hobby decision making” so other modules (like app.js) can use it.

// Calculates points for Selected Hobby 
const calculateSelectionPoints = (selection) => {      // @param {dropdown} selected hobby - hobby choices
    switch(selection) {
        case "Board/Tabletop Roleplaying Games": return 18;
        case "Camping/Hiking": return 8;
        case "Cooking/Baking": return 20;
        case "Drawing/Painting": return 28;
        case "Exercise/Sports": return 14;
        case "Fishing": return 12;
        case "Gardening": return 16;
        case "Learning a Language": return 4;
        case "Learning an Instrument": return 6;
        case "Photography": return 24;
        case "Reading": return 30;
        case "Sewing/Embroidery": return 22;
        case "Traveling": return 2;
        case "Woodwork": return 10;
        case "Writing/Poetry": return 26;
        default: return 0;
    }
};

// Calculates points for Time
const calculateTimePoints = (time) => {    // @param {number} time - available time to do the hobby
    if(time === 1) return 4;    // omits block delimiters for single statements
    else if (time === 2) return 6;
    else if (time === 3) return 8;
    else if (time === 4) return 10;
    else if (time === 5) return 12;  
    else if (time > 5) return 14;       // 6+ hours total
    return 0;       // Default or invalid input
};

// Calculates points for Funding 
const calculateFundingPoints = (funding) => {      // @param{number} funding - funding available to support hobby
    if (funding > 100) return 30;       // @returns {number} Points for funding.    
    else if (funding >= 50) return 25;
    else if (funding >= 30) return 20;
    else if (funding >= 10) return 10;
    else if (funding >= 1) return 5;      
    return 0;     // Default or invalid input
};

// Calculates points for Social Level
const calculateSocialPoints = (social, selection) => {     // @param {string} socialpoints - Hobby's socialization requirements (“Solo”, “Friends Only”, “Invite Everyone”)
    const noSocial = "Solo";      
    const lowSocial = "Friends Only";      
    const highSocial = "Invite Everyone";    

    const group1 = ["Gardening", "Sewing/Embroidery", "Photography", "Writing/Poetry", "Reading"];      // Hobbies are grouped based on higher or lower socializing
    const group2 = ["Learning a Language", "Learning an Instrument", "Woodwork", "Drawing/Painting", "Cooking/Baking"];
    const group3 = ["Traveling", "Camping/Hiking", "Exercise/Sports", "Board/Tabletop Roleplaying Games", "Fishing"];

    if (group1.includes(selection)) {    // Different points are provided based on desired social level and selected activity
        if (social === noSocial) return 10;
        if (social === lowSocial) return 8;
        if (social === highSocial) return 4;
    } else if (group2.includes(selection)) {
        if (social === noSocial) return 4;
        if (social === lowSocial) return 10;
        if (social === highSocial) return 8;
    } else if (group3.includes(selection)) {
        if (social === noSocial) return 4;
        if (social === lowSocial) return 8;
        if (social === highSocial) return 10;
    }
    return 0;       // Default or invalid input
};

// Calculates points for Dedication 
const calculateDedicationPoints = (dedication) => {    // @returns {number} Points for commitment.
    switch(dedication) {
        case "Committed": return 12;
        case "Interested": return 6;
        case "Lost Cause": return 2;
        default: return 0;
    }
}

// Return the breakdown of points for each category
export const calculateHobby = (data) => {     // @param {Object} data - An object containing input values for the categories:
    const selectionPoints = calculateSelectionPoints(data.selectedHobby);
    const fundingPoints = calculateFundingPoints(data.funding);
    const socialPoints = calculateSocialPoints(data.social, data.selectedHobby);
    const dedicationPoints = calculateDedicationPoints(data.dedication);
   
    let timePoints = 0;

    if (data.noTimeAvailable) {
        timePoints = 0;      // If checkbox is selected, set 0 pts and message
    } else {
        timePoints = calculateTimePoints(data.time);        // Points calculated normally if unchecked
    }

// Sum up all category points for the total hobby points
const totalHobbyPoints = selectionPoints + timePoints + fundingPoints + socialPoints + dedicationPoints;

let finalDecisionHeadline;     // Provides a response to selected options
let finalDecisionDetail;        // Provides more detail to response


if (totalHobbyPoints >= 70 && totalHobbyPoints <= 100) {
    finalDecisionHeadline = "Go for It!";
    finalDecisionDetail = "Based on the selected options, this activity is a good fit. Enjoy your new hobby.";
} else if (totalHobbyPoints >= 41 && totalHobbyPoints <= 69) {
    finalDecisionHeadline = "Give it a Try";
    finalDecisionDetail = "Based on the selected options, this activity could go either way. Try it for a few days and decide afterward.";
} else {
    finalDecisionHeadline = "Save for Later"; 
    finalDecisionDetail = "Based on the selected options, this activity is not the best fit for now. Select another and come back to this hobby at a later time.";
}

    return {
        selectedHobby: data.selectedHobby,      // Original Input Data
        time: data.time,
        funding: data.funding,
        social: data.social,
        dedication: data.dedication,
        
        totalHobby: totalHobbyPoints,       // Calculated points and decision text
        selectionPoints: selectionPoints,
        timePoints: timePoints,
        fundingPoints: fundingPoints,
        socialPoints: socialPoints,
        dedicationPoints: dedicationPoints,
        finalDecisionHeadline: finalDecisionHeadline,
        finalDecisionDetail: finalDecisionDetail
    };
};

export const compareHobbyResults = (hobby1, hobby2) => {       // Coding integrated from Google Search, corrected by Gemini
    if (!hobby1 || !hobby2 || typeof hobby1.totalHobby !== "number" || typeof hobby2.totalHobby !== "number") {
        return {
            winner: "Error",
            message: "Cannot Compare: Invalid hobby data provided."
        };
}

    const score1 = hobby1.totalHobby;
    const score2 = hobby2.totalHobby;
    const diff = Math.abs(score1 - score2);
    let winner = "Tie";
    let message = `Both hobbies scored the same with ${score1} points.`

    if (score1 > score2) {
        winner = "Hobby 1";
        message = `${hobby1.selectedHobby} is better by ${diff} points.`;
    } else if (score2 > score1) {
        winner = "Hobby 2";
        message = `${hobby2.selectedHobby} is better by ${diff} points.`;
    }

    return {
        winner: winner,
        message: message,
        scoreDifference: diff
    };
};
