// This module handles displaying and hiding the calculated hobby results on the page.

import {compareHobbyResults} from "./decision.js";      // Corrections from Gemini
const resultsContainer = document.getElementById('results');      // References the HTML elements where the results will display.  
const compareSection = document.getElementById("compareSection"); // References compare section
const resetCompareButton = document.getElementById("resetCompareButton");

const hobby1ComparePanel = document.getElementById("hobby1Compare");
const hobby2ComparePanel = document.getElementById("hobby2Compare");

const compareResultContainer = document.createElement("div");       // Integrated with Google Search's help
compareResultContainer.id = "compareResult";
compareResultContainer.classList.add("compare-result");
compareSection.append(compareResultContainer);      

const totalHobbyDisplay = resultsContainer.querySelector("#hResults");     // Uses resultsContainer.querySelector() to get elements inside the resultsContainer
const finalDecisionHeadlineDisplay = document.getElementById("finalDecisionHeadline");
const finalDecisionDetailDisplay = document.getElementById("finalDecisionDetail");
const selectionDisplay = resultsContainer.querySelector("#selection"); 
const timeDisplay = resultsContainer.querySelector("#time"); 
const fundingDisplay = resultsContainer.querySelector("#funding"); 
const socialDisplay = resultsContainer.querySelector("#social"); 
const dedicationDisplay = resultsContainer.querySelector("#dedication"); 

// Updates the text content of each display element with the calculated points
export const displayResults = (results) => {       // Displays the calculated hobby point results in the results section.
    totalHobbyDisplay.textContent = `${results.totalHobby} Pts`;     // @param {Object} results - An object containing the hobby values (points).
    finalDecisionHeadlineDisplay.textContent = results.finalDecisionHeadline;
    finalDecisionDetailDisplay.textContent = results.finalDecisionDetail;
    selectionDisplay.innerHTML = `<b>Hobby:</b> ${results.selectedHobby} (${results.selectionPoints} Pts)`;
   
    timeDisplay.innerHTML = `<b>Hours:</b> ${results.time} (${results.timePoints} Pts)`;          // Corrected by Gemini
    fundingDisplay.innerHTML = `<b>Funding:</b> $${results.funding} (${results.fundingPoints} Pts)`;
    socialDisplay.innerHTML = `<b>Social:</b> ${results.social} (${results.socialPoints} Pts)`;
    dedicationDisplay.innerHTML = `<b>Dedication:</b> ${results.dedication} (${results.dedicationPoints} Pts)`;

    resultsContainer.style.display = "block";      // Makes the entire results section visible
};

export const hideResults = () => {     // Hides the entire results section.
    resultsContainer.style.display = "none";
};

export const clearCompareDisplay = () => {
    updateCompareDisplay([]);
};

export const updateCompareDisplay = (entries) => {     // Function provided with Google Search's help
    const selectedCount = entries.length;
    
    compareSection.style.display = selectedCount > 0 ? "block": "none";
    resetCompareButton.style.display = selectedCount > 0 ? "block": "none";
    compareResultContainer.innerHTML = "";
    
    const panels = [
        {
            element: hobby1ComparePanel,
            nameId: "hobby1Name",
            totalId: "totalHobby1",
            breakdownId: "compareBreakdown1"
        },
        {
            element: hobby2ComparePanel,
            nameId: "hobby2Name",
            totalId: "totalHobby2",
            breakdownId: "compareBreakdown2"
        }
    ];

      for (let i =0; i < 2; i++) {      // Corrected with Gemini
        const entry = entries[i];
        const panelData = panels[i];

        const panelElement = panelData.element;
        const nameElement = panelElement.querySelector(`#${panelData.nameId}`);
        const totalElement = panelElement.querySelector(`#${panelData.totalId}`);
        const breakdownElement = panelElement.querySelector(`#${panelData.breakdownId}`);   

        panelElement.classList.remove("winner");

        if (entry) {
            nameElement.textContent = entry.selectedHobby;      // Updates comparison panel with entry data
            totalElement.textContent = `${entry.totalHobby} Pts`;       //Inconsistency caught by Gemini
            
            const timeDetail = `Time: ${entry.timePoints} Pts`
            
            breakdownElement.innerHTML = `
                <li>${timeDetail}</li>
                <li>Funding: ${entry.fundingPoints} Pts</li>
                <li>Social: ${entry.socialPoints} Pts</li>
                <li>Dedication: ${entry.dedicationPoints} Pts</li>
            `;
        } else {
            nameElement.textContent = `Select from table (${selectedCount} Selected)`;     
            totalElement.textContent = "0 Points";
            breakdownElement.innerHTML = `
                <li>Time: 0 Pts</li>
                <li>Funding: 0 Pts</li>
                <li>Social: 0 Pts</li>
                <li>Dedication: 0 Pts</li>
            `;
        }
    }

    if (selectedCount === 2) {      // Integrated thanks to Google Search and Gemini's help
        const hobby1 = entries [0];
        const hobby2 = entries [1];

        const compareResult = compareHobbyResults(hobby1, hobby2);

        const hobby1Panel = panels[0].element;
        const hobby2Panel = panels[1].element;
    
    if (compareResult.winner === "Hobby 1") {
        hobby1Panel.classList.add("winner");
    } else if (compareResult.winner === "Hobby 2") {
        hobby2Panel.classList.add("winner");
    }
    
    compareResultContainer.innerHTML = `
        <p class="compare-message"><strong>${compareResult.winner === "Tie" ? compareResult.winner : compareResult.winner + " Wins! "}</strong></p>
        <p>${compareResult.message}</p>
        `;   
    if (compareSection) {     
        compareSection.scrollIntoView({behavior: "smooth"});
    }
  }
}

